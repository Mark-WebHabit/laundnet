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
import { ref, remove } from "firebase/database";
import { db } from "../../firebase";

function createData(username, phone, address, uid) {
  return {
    username,
    phone,
    address,
    uid,
  };
}

function Row(props) {
  const { row } = props;

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={`transition-all duration-200 hover:bg-black/30 border-l-2 ${
          props.open ? "border-red-500" : "border-transparent"
        }`}
      >
        <TableCell component="th" scope="row">
          {row.username}
        </TableCell>
        <TableCell align="left">{row.phone}</TableCell>
        <TableCell align="left">{row.address}</TableCell>
        <TableCell align="center">
          <FontAwesomeIcon
            icon={faTrash}
            className="text-red-800 cursor-pointer"
            size="xl"
            onClick={() => {
              const id = props.row.uid;
              const customerRef = ref(db, `users/${id}`);

              const isContinue = window.confirm(
                "Are you sure to delete this user?. this can't be undone"
              );

              if (!isContinue) {
                return;
              } else {
                remove(customerRef).catch((error) => alert(error.message));
              }
            }}
          />
        </TableCell>
      </TableRow>
      <TableRow className="border-l-2 border-red-500">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={props.open} timeout="auto" unmountOnExit></Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    username: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CollapsibleTable() {
  const [searchName, setSearchName] = React.useState("");
  const [open, setOpen] = useState(null);
  const [rows, setRows] = useState([]);

  const { customers } = useContext(DataContext);

  useEffect(() => {
    const newRows = customers?.map((row) => {
      return createData(row?.username, row?.phone, row?.address, row?.uid);
    });

    setRows(newRows);
  }, [customers]);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row?.username?.toLowerCase().includes(searchName.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Username", "Phone", "Address"];
    const csvData = filteredRows
      .map((row) => {
        const newAddress = row.address.replace(/,/g, " ");
        return [row.username, row.phone, newAddress].join(",");
      })
      .join("\n");

    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + csvData;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, i) => (
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
        </Table>
      </TableContainer>
    </Box>
  );
}
