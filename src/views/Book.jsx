import React, { useContext, useEffect, useState } from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import QRCode from "qrcode";

import { DataContext } from "../context/DataStore";
import { push, set, child } from "firebase/database";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { db } from "../../firebase";

import { useNavigate } from "react-router-dom";
dayjs.extend(localizedFormat);

function Book() {
  const [weight, setWeight] = useState("");
  const [addsOn, setAddsOn] = useState([]);
  const [dt, setDt] = useState("");
  const [formattedDt, setFormattedDt] = useState(null);
  const [invalidTimes, setInvalidTimes] = useState([]);
  const [addsOnTotal, setAddsOnTotal] = useState(0);
  const [weightFee, setWeightFee] = useState(0);
  const [adds, setAdds] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const navigate = useNavigate();

  const { services, ordersRef, orders, weightPrice, user } =
    useContext(DataContext);

  useEffect(() => {
    const formattedDate = dayjs(dt).format("MMMM D YYYY h:mm A");
    setFormattedDt(formattedDate);
  }, [dt]);

  useEffect(() => {
    const additionalsArr =
      addsOn && addsOn.length > 0
        ? addsOn.map((item) => ({
            [item.name]: parseFloat(item.price),
          }))
        : [];

    const sum = additionalsArr?.length
      ? additionalsArr.reduce((sum, item) => {
          const price = Object.values(item)[0];
          return sum + price;
        }, 0)
      : 0;
    setAdds(additionalsArr);
    setAddsOnTotal(sum);
  }, [addsOn]);

  useEffect(() => {
    setWeightFee(weightPrice * weight);
  }, [weight, weightPrice]);

  useEffect(() => {
    if (orders) {
      const selectedDate = dayjs(dt).format("MMMM D");
      const invalidTimes = orders
        .filter(
          (order) =>
            order.monthDay === selectedDate &&
            order.year === String(dayjs(dt).year())
        )
        .map((order) => order.time);
      setInvalidTimes(invalidTimes);
    }
  }, [dt, orders]);

  const handleSubmit = async () => {
    if (weight <= 0) {
      alert("Please enter a weight");
      return;
    }

    if (!dt) {
      alert("Please select a date and time");
      return;
    }

    const formattedTime = dayjs(dt).format("h:mm A");
    if (invalidTimes.includes(formattedTime)) {
      alert(
        "The selected time is already taken. Please choose a different time."
      );
      return;
    }

    const orderid = push(ordersRef).key; // Get the unique ID from the push
    const qrUrl = `${import.meta.env.VITE_BASE_URL}/booked/${orderid}/${
      user.uid
    }`;
    const qrCode = await QRCode.toDataURL(qrUrl);

    const data = {
      weight,
      weightCost: weightFee,
      addsOn: adds,
      addsOnCost: addsOnTotal,
      date: formattedDt,
      overAllTotal: addsOnTotal + weightFee,
      status: "Pending",
      userId: user.uid,
      qrCodeUrl: qrCode, // Add QR code URL to data
    };

    try {
      await set(child(ordersRef, orderid), data);
      setWeight(0);
      setAddsOn([]);
      alert("Order Placed");

      // Prompt user to download the QR code before redirecting
      const downloadLink = document.createElement("a");
      downloadLink.href = qrCode;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Navigate to the user page after downloading the QR code
      navigate("/user");
    } catch (error) {
      alert(error.message);
    }
  };

  const filterTime = (time) => {
    const timeString = dayjs(time).format("h:mm A");
    return !invalidTimes.includes(timeString);
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 bg-black/30 z-20 grid place-items-center">
      <div className="w-full max-w-[600px] bg-white rounded-[10px] p-4">
        <h2 className="font-bold text-center uppercase text-2xl mb-4">
          Reservation Form
        </h2>

        <div className="w-full">
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
          <div className=" grid place-items-center my-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                selected={dt}
                onChange={(date) => setDt(date)}
                showTimeSelect
                minDate={new Date()}
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                filterTime={filterTime}
                inline
              />
            </LocalizationProvider>
          </div>

          <p className="mt-4 text-center font-bold">Additionals</p>
          {services && services?.length > 0
            ? services.map((add) => (
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

        <div className="flex justify-between items-center my-4">
          <p>Additional Total: {addsOnTotal}</p>
          <p>Base Fee: {weightFee}</p>
          <p>Overall Total: {weightFee + addsOnTotal}</p>
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
              navigate("/user");
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default Book;
