import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DataContext } from "../context/DataStore";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";

function Row(props) {
  const { row } = props;

  const handleUpdate = (uid, flag = "Preparing") => {
    const orderRef = ref(db, `orders/${uid}`);

    const isOk = window.confirm("Are you sure? this cannot be undone.");

    if (!isOk) {
      return;
    }

    update(orderRef, {
      status: flag,
    }).catch((error) => alert(error.message));
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={`transition-all duration-200 hover:bg-black/30 border-l-2 border-r-2 ${
          props.open ? "border-red-500 bg-green-50" : "border-transparent"
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
        <TableCell align="left">
          {row?.referenceNumber ? row.referenceNumber : "N/A"}
        </TableCell>
        <TableCell align="left">
          {row?.proof ? (
            <img
              src={row.proof}
              alt="Proof"
              className="w-[60px] aspect-square"
              onClick={() => window.open(row.proof, "_blank")}
            />
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell align="center" className="flex items-center justify-center">
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-xl cursor-pointer mx-1"
            onClick={() => handleUpdate(row.uid, "Cancelled")}
          >
            Decline
          </button>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-xl cursor-pointer mx-1"
            onClick={() => handleUpdate(row.uid, "Preparing")}
          >
            Process
          </button>
        </TableCell>
      </TableRow>
      <TableRow
        className={`border-l-2 border-b-2 border-r-2 ${
          props.open ? "border-red-500 bg-green-50" : "border-transparent"
        }`}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell align="left">Cost</TableCell>
                    <TableCell align="left">Additionals</TableCell>
                    <TableCell align="left">₱ Total price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.monthDay}>
                    <TableCell component="th" scope="row">
                      {row.monthDay}
                    </TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell align="left">{row.weightCost}</TableCell>
                    <TableCell align="left">{row?.additional ?? ""}</TableCell>
                    <TableCell align="left">
                      {Math.round(row.overAllTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Reservations() {
  const [searchName, setSearchName] = React.useState("");
  const [open, setOpen] = useState(null);
  const [orders, setOrders] = useState([]);

  const { orders: orderStore } = useContext(DataContext);

  console.log(orderStore);

  useEffect(() => {
    if (orderStore?.length < 0) {
      setOrders([]);
      return;
    }

    const newOrder = orderStore.filter((ord) => ord.status === "Pending");

    setOrders(newOrder);
  }, [orderStore]);

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredRows = orders.filter((row) => {
    return row?.username?.toLowerCase().includes(searchName.toLowerCase());
  });

  const exportToCSV = () => {
    const headers = [
      "Username",
      "Phone",
      "Address",
      "Date",
      "Time",
      "Year",
      "Weight",
      "Weight Fee",
      "Additionals",
      "Additionals Fee",
      "Total price (₱)",
    ];

    let csvData = filteredRows
      .map((row) => {
        const adds = row?.additional?.replace(/,/g, " ");
        const newaddress = row?.address?.replace(/,/g, " ");

        return [
          row.username,
          row.phone,
          newaddress,
          row.monthDay,
          row.time,
          row.year,
          row.weight,
          row.weightCost,
          adds,
          row.addsOnCost,
          row.overAllTotal,
        ].join(",");
      })
      .join("\n");

    const csvContent =
      "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + csvData;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reservation_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box className="mt-2 flex flex-col  h-full">
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
      {orders?.length > 0 ? (
        <TableContainer component={Paper} className="h-full max-h-full  ">
          <Table aria-label="collapsible table">
            <TableHead className=" bg-red-700/30">
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Address</TableCell>
                <TableCell align="left">Reference</TableCell>
                <TableCell align="left">Proof</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            {orders?.length > 0 && (
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
            )}
          </Table>
        </TableContainer>
      ) : (
        <p className="text-center mt-8 text-4xl font-bold">No orders</p>
      )}
    </Box>
  );
}
