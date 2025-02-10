import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../context/DataStore";

function Row(props) {
  const { row, filterDate } = props;

  const filteredHistory = row?.history?.filter((historyRow) =>
    filterDate ? historyRow.date.includes(filterDate) : true
  );

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={`transition-all duration-200 hover:bg-black/30 border-l-2 ${
          props.open ? "border-red-500" : "border-transparent"
        }`}
        onClick={() => {
          props.onOpen();
        }}
      >
        <TableCell component="th" scope="row">
          {row.username}
        </TableCell>
        <TableCell align="left">{row.phone}</TableCell>
        <TableCell align="left">{row.address}</TableCell>
      </TableRow>
      <TableRow className="border-l-2 border-red-500">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {filteredHistory?.length > 0
                  ? "History"
                  : "No Transactions yet"}
              </Typography>
              {filteredHistory?.length > 0 && (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="left">Weight Fee</TableCell>
                      <TableCell align="left">Additionals</TableCell>
                      <TableCell align="left">Total price (₱)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHistory &&
                      filteredHistory?.map((historyRow) => (
                        <TableRow key={historyRow.uid}>
                          <TableCell component="th" scope="row">
                            {historyRow.monthDay}
                          </TableCell>
                          <TableCell>{historyRow.time}</TableCell>
                          <TableCell align="left">
                            {historyRow.weightCost}
                          </TableCell>

                          <TableCell align="left">
                            {historyRow?.additional || ""}
                          </TableCell>
                          <TableCell align="left">
                            {historyRow.overAllTotal}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const [searchName, setSearchName] = React.useState("");
  const [open, setOpen] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const { orderHistory: oH } = useContext(DataContext);
  useEffect(() => {
    if (!searchName) {
      setOrderHistory(oH);
      return;
    }

    const filter = oH.filter((o) =>
      o.username?.toLowerCase().includes(searchName)
    );

    setOrderHistory(filter ?? []);
  }, [searchName, oH]);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredRows = orderHistory?.filter((row) =>
    row?.username?.toLowerCase().includes(searchName.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = [
      "Username",
      "Phone",
      "Address",
      "Date",
      "Time",
      "Year",
      "Weight Fee",
      "Additionals",
      "Additionals Fee",
      "Total price (₱)",
    ];

    let csvData = filteredRows
      .map((row) => {
        return row.history
          .filter((historyRow) => true === true)
          .map((historyRow) => {
            const adds = historyRow?.additional?.replace(/,/g, " ");
            const newaddress = row?.address?.replace(/,/g, " ");
            return [
              row.username,
              row.phone,
              newaddress,
              historyRow.monthDay,
              historyRow.time,
              historyRow.year,
              historyRow.weightCost,
              adds || "None",
              historyRow.addsOnCost || 0,
              historyRow.overAllTotal,
            ].join(",");
          })
          .join("\n");
      })
      .join("\n");

    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + csvData;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchName}
          onChange={handleSearchNameChange}
          className="bg-white"
        />

        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Export as CSV
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead className=" bg-red-700/30">
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="left">Phone</TableCell>
              <TableCell align="left">Address</TableCell>
            </TableRow>
          </TableHead>
          {orderHistory?.length > 0 && (
            <TableBody>
              {orderHistory.map((row, i) => (
                <Row
                  key={row.uid}
                  row={row}
                  open={open === i}
                  onOpen={() => {
                    if (open === i) {
                      setOpen(null);
                    } else {
                      setOpen(i);
                    }
                  }}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
