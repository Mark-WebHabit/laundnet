import React, { useContext, useEffect, useState } from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { DataContext } from "../context/DataStore";
import { push, set } from "firebase/database";
import { db } from "../../firebase";
dayjs.extend(localizedFormat);

function WalkinModal({ setAddTransaction }) {
  const [username, setUsername] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [addsOn, setAddsOn] = useState([]);
  const [dt, setDt] = useState(dayjs());
  const [formattedDt, setFormattedDt] = useState(null);

  const { services, ordersRef, weightPrice } = useContext(DataContext);

  useEffect(() => {
    const formattedDate = dt.format("MMMM D YYYY h:00 A");
    setFormattedDt(formattedDate);
  }, [dt]);

  const handleSubmit = () => {
    // Input validation
    if (!username || username.trim() === "") {
      alert("Username is required");
      return;
    }

    if (!address || address.trim() === "") {
      alert("Address is required");
      return;
    }

    const phonePattern = /^09\d{9}$/;
    if (!phonePattern.test(contactNumber)) {
      alert("Phone number must be 11 digits and start with 09");
      return;
    }

    const adds =
      addsOn && addsOn.length > 0
        ? addsOn.map((item) => ({
            [item.name]: parseFloat(item.price),
          }))
        : [];

    const sum = adds?.length
      ? adds.reduce((sum, item) => {
          const price = Object.values(item)[0];
          return sum + price;
        }, 0)
      : 0;

    const weightFee = weight * weightPrice;

    const data = {
      username,
      phone: contactNumber,
      address,
      weight,
      weightCost: weightFee,
      addsOn: adds,
      addsOnCost: sum,
      date: formattedDt,
      overAllTotal: sum + weightFee,
      status: "Preparing",
    };

    const ordersRefpush = push(ordersRef);

    set(ordersRefpush, data)
      .then(() => {
        // Reset state variables
        setUsername("");
        setContactNumber("");
        setAddress("");
        setWeight(0);
        setAddsOn([]);
        setAddTransaction(false);
        alert("Order Placed");
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="fixed w-screen h-screen top-0 left-0 bg-black/30 z-20 grid place-items-center">
      <div className="w-full max-w-[600px] bg-white rounded-[10px] p-4">
        <h2 className="font-bold text-center uppercase text-2xl mb-4">
          Add Transaction
        </h2>

        <div className="w-full">
          <div className="my-2">
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white w-full"
            />
          </div>

          <div className="my-2">
            <TextField
              label="Contact number"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="bg-white w-full"
            />
          </div>
          <div className="my-2">
            <TextField
              label="Complete Address   "
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white w-full"
            />
          </div>
          <div className="my-2">
            <TextField
              label={`Weight (₱${weightPrice}/KG)`}
              variant="outlined"
              type="number"
              value={weight}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val > 0) {
                  setWeight(val);
                }
              }}
              className="bg-white w-full"
            />
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date & Time picker"
              value={dt}
              onChange={(newValue) => {
                setDt(newValue);
              }}
              views={["year", "month", "day", "hours"]}
              minDate={dayjs()}
            />
          </LocalizationProvider>

          <p className="mt-4 text-center font-bold">Additionals</p>
          {services && services?.length > 0
            ? services.map((add, i) => (
                <FormControlLabel
                  key={add.uid}
                  control={
                    <Checkbox
                      checked={addsOn.includes(add)}
                      onChange={() => {
                        if (!addsOn.includes(add)) {
                          setAddsOn((prev) => [...prev, add]);
                        } else {
                          const newadd = addsOn.filter((el) => el !== add);

                          setAddsOn(newadd);
                        }
                      }}
                      name={add.name}
                      color="primary"
                    />
                  }
                  label={add.name}
                />
              ))
            : null}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 rounded-xl text-white font-bold"
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded-xl text-white font-bold"
            onClick={() => {
              setUsername("");
              setContactNumber("");
              setWeight("");
              setAddress("");

              setAddsOn([]);
              setAddTransaction(false);
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalkinModal;
