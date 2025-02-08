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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataContext } from "../context/DataStore";
import { push, ref, remove } from "firebase/database";
import { db } from "../../firebase";

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

function createData(service, desc, price) {
  return { service, desc, price };
}

export default function ServicesTable() {
  const [rows, setRows] = React.useState([]);

  const { services, servicesRef } = React.useContext(DataContext);
  const [newService, setNewService] = React.useState({
    name: "",
    description: "",
    price: "",
  });

  React.useEffect(() => {
    setRows(services);
  }, [services]);

  const handleAddService = () => {
    // setRows([
    //   ...rows,
    //   createData(newService.service, newService.desc, Number(newService.price)),
    // ]);

    if (!newService.name || !newService.description || !newService.price) {
      alert("All fields are required");
      return;
    }

    push(servicesRef, newService)
      .then(() => {
        setNewService({ name: "", description: "", price: "" });
      })
      .catch((error) => alert(error.message));
  };

  const handleDelete = (uid) => {
    const serviceRef = ref(db, `services/${uid}`);
    remove(serviceRef).catch((error) => alert(error.message));
  };

  return (
    <div>
      <div className="mb-[20px]">
        <TextField
          label="Service"
          variant="outlined"
          value={newService.name}
          onChange={(e) =>
            setNewService({ ...newService, name: e.target.value })
          }
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={newService.description}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          value={newService.price}
          onChange={(e) =>
            setNewService({ ...newService, price: e.target.value })
          }
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddService}>
          Add Service
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Service</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Price</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.uid}>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="left">{row.price}</StyledTableCell>
                <StyledTableCell align="left">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.uid)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
