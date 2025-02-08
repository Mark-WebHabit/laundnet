import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(date, totalSales) {
  return { date, totalSales };
}

export default function Daily() {
  const [rows, setRows] = React.useState([
    createData("February 1 2025", 1200),
    createData("February 2 2025", 1200),
    createData("February 3 2025", 1200),
    createData("February 4 2025", 1200),
    createData("February 5 2025", 1200),
    createData("February 6 2025", 1200),
  ]);

  const [month, setMonth] = React.useState("");
  const [numDates, setNumDates] = React.useState(0);
  const [filteredRows, setFilteredRows] = React.useState(rows);

  React.useEffect(() => {
    if (month) {
      const newRows = rows.filter((el) =>
        el.date.toLowerCase().includes(month.toLowerCase())
      );

      setFilteredRows(newRows);
    } else {
      setFilteredRows(rows);
    }
  }, [month]);

  React.useEffect(() => {
    if (numDates && numDates > 0) {
      const newRows = rows.slice(0, numDates);
      setFilteredRows(newRows);
    } else {
      setFilteredRows(rows);
    }
  }, [numDates]);

  const exportCSV = () => {
    const totalSales = filteredRows.reduce(
      (acc, row) => acc + row.totalSales,
      0
    );
    const csvRows = [
      ["Date", "Total Sales"],
      ...filteredRows.map((row) => [row.date, row.totalSales]),
      ["Total", totalSales],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div className="my-4 flex items-center gap-8">
        <TextField
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white"
        />
        <TextField
          label="Number of Dates"
          type="number"
          value={numDates}
          onChange={(e) => setNumDates(e.target.value)}
          className="bg-white"
        />
        <button
          onClick={exportCSV}
          className="text-white bg-blue-500 px-4 py-2 rounded-[10px] cursor-pointer"
        >
          Export as CSV
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Date</StyledTableCell>
              <StyledTableCell align="left">Total Sales</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <StyledTableRow key={row.date}>
                <StyledTableCell align="left">{row.date}</StyledTableCell>
                <StyledTableCell align="left">{row.totalSales}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
