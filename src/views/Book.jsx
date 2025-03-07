import React, { useContext, useEffect, useState } from "react";
import { TextField, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import QRCode from "qrcode";
import { Modal, Fade, Backdrop } from "@mui/material";

import { DataContext } from "../context/DataStore";
import { push, set, child } from "firebase/database";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { supabase } from "../context/DataStore";
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

  // transaction
  const [isPay, setIsPay] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);

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

  const handlePay = async () => {
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

    setIsPay(true);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a proof of payment");
      return;
    }

    if (amount < addsOnTotal + weightFee) {
      alert("Amount can't be lower than cost");
      return;
    }

    const fileUrl = await uploadImage(file);

    if (!fileUrl) {
      alert("Proof not uploaded. Try again");
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
      referenceNumber,
      proof: fileUrl,
      amountPresented: amount,
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    console.log(selectedFile);

    if (selectedFile && selectedFile?.type?.startsWith("image/")) {
      setFile(selectedFile);
    } else {
      alert("Please upload an image file.");
      setFile(null);
    }
  };

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`; // Unique filename
    const { data, error } = await supabase.storage
      .from("medias") // Replace with your bucket name
      .upload(fileName, file);

    if (error) {
      alert("Upload error: " + error.message);
      return null;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("medias")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl; // Use this URL to display or store
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
            onClick={handlePay}
          >
            PAY
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded-xl text-white font-bold"
            onClick={() => {
              navigate("/user");
            }}
          >
            CANCEL
          </button>
          <Modal
            open={isPay}
            onClose={() => setIsPay(false)}
            BackdropComponent={Backdrop} // ✅ Correct
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={isPay}>
              <div className="p-6 rounded-lg scale-z-100 w-screen h-screen grid place-items-center">
                <div className="w-full max-w-[500px] min-w-[250px] py-8 px-4 bg-white rounded-2xl shadow-lg">
                  <img
                    src="/images/qr.jpg"
                    alt="QR"
                    className="w-[300px] aspect-square  mx-auto border mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Details
                  </h2>

                  {/* Reference Number */}
                  <label className="block mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />

                  {/* Amount */}
                  <label className="block mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    minLength={4}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />

                  {/* File Upload */}
                  <label className="block mb-2">Upload Proof (JPG only)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />

                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setIsPay(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!referenceNumber || !amount || !file}
                      className={`px-4 py-2 rounded text-white ${
                        referenceNumber && amount && file
                          ? "bg-blue-500"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Submit Payment
                    </button>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>

      {/* for payment */}
    </div>
  );
}

export default Book;
