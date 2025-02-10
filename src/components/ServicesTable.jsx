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
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { DataContext } from "../context/DataStore";
import { push, ref, remove, update } from "firebase/database";
import { db } from "../../firebase";
import { useRef } from "react";

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

export default function ServicesTable() {
  const [rows, setRows] = React.useState([]);
  const [editPrice, setEditPrice] = React.useState(false);
  const { services, servicesRef, weightPrice, setWeightPrice } =
    React.useContext(DataContext);
  const [newService, setNewService] = React.useState({
    name: "",
    description: "",
    price: "",
  });

  const weightRef = useRef(null);

  React.useEffect(() => {
    setRows(services);
  }, [services]);

  React.useEffect(() => {
    if (weightRef?.current) {
      weightRef.current.focus();
    }
  }, [weightRef, editPrice]);

  const handleAddService = () => {
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

  const handleChangePrice = () => {
    if (weightPrice <= 0) {
      alert("Service fee cannot be lower than 0");
      return;
    }

    const priceRef = ref(db, "serviceFee");

    update(priceRef, {
      price: weightPrice,
    })
      .then(() => setEditPrice(false))
      .catch((error) => alert(error.message));
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
            <StyledTableRow>
              <StyledTableCell align="left">Service fee</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
              <StyledTableCell align="left">
                <input
                  type="number"
                  value={weightPrice}
                  onChange={(e) => setWeightPrice(e.target.value)}
                  disabled={!editPrice}
                  ref={weightRef}
                />
              </StyledTableCell>
              <StyledTableCell align="left">
                {!editPrice ? (
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setEditPrice(true);
                    }}
                  >
                    <EditIcon className="text-blue-600" />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleChangePrice()}
                  >
                    <SaveIcon className="text-blue-600" />
                  </IconButton>
                )}
              </StyledTableCell>
            </StyledTableRow>
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
                    <DeleteIcon className="text-red-800" />
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
