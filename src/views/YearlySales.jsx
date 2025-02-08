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

export default function YearlySales({ yearly }) {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    setRows(yearly);
    console.log(yearly);
  }, [yearly]);

  const exportCSV = () => {
    const totalSales = rows.reduce((acc, row) => acc + row.totalSales, 0);
    const csvRows = [
      ["Year", "Total Sales"],
      ...rows.map((row) => [row.year, row.totalSales]),
      ["Total", totalSales],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "yearly_sales_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <div className="my-4 flex items-center gap-8">
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
            {rows.map((row, i) => (
              <StyledTableRow key={row.year}>
                <StyledTableCell align="left">{row.year}</StyledTableCell>
                <StyledTableCell align="left">{row.totalSales}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
