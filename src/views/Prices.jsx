import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { DataContext } from "../context/DataStore";

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

export default function Prices() {
  const [rows, setRows] = React.useState([]);

  const { services, weightPrice } = React.useContext(DataContext);

  React.useEffect(() => {
    setRows(services);
  }, [services]);

  return (
    <div className="flex-1">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Service</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Price</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align="left">Base Price</StyledTableCell>
              <StyledTableCell align="left">
                Base price = Price × Weight of the laundry
              </StyledTableCell>
              <StyledTableCell align="left">{weightPrice}</StyledTableCell>
            </StyledTableRow>
            {rows.map((row) => (
              <StyledTableRow key={row.uid}>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="left">{row.price}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
