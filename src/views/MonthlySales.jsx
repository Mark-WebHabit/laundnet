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

export default function MonthlySales({ monthly }) {
  const [rows, setRows] = React.useState([]);

  const [year, setYear] = React.useState(String(new Date().getFullYear()));
  const [numDates, setNumDates] = React.useState(0);
  const [filteredRows, setFilteredRows] = React.useState([]);

  React.useEffect(() => {
    setRows(monthly);
  }, [monthly]);

  React.useEffect(() => {
    let newRows = rows;

    if (year) {
      newRows = newRows.filter((el) =>
        el.date.toLowerCase().includes(String(year))
      );
    }

    if (numDates && numDates > 0) {
      newRows = newRows.slice(0, numDates);
    }

    setFilteredRows(newRows);
  }, [year, numDates, rows]);

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
    link.setAttribute("download", "monthly_sales_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div className="my-4 flex items-center gap-8">
        <TextField
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-white"
          type="number"
        />
        <TextField
          label="Number of Months"
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
