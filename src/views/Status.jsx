import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaHandHolding,
  FaSpinner,
  FaTshirt,
  FaBox,
} from "react-icons/fa";
import { DataContext } from "../context/DataStore";

const statusIcons = {
  Pending: <FaClock className="text-yellow-500 text-6xl mb-4 animate-icon" />,
  Preparing: <FaSpinner className="text-blue-500 text-6xl mb-4 animate-icon" />,
  Wash: <FaTshirt className="text-blue-500 text-6xl mb-4 animate-icon" />,
  Fold: <FaHandHolding className="text-blue-500 text-6xl mb-4 animate-icon" />,
  Dry: <FaTshirt className="text-blue-500 text-6xl mb-4 animate-icon" />,
  "For Pick Up": <FaBox className="text-blue-500 text-6xl mb-4 animate-icon" />,
  "For Deliver": (
    <FaTruck className="text-blue-500 text-6xl mb-4 animate-icon" />
  ),
  Delivered: (
    <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-icon" />
  ),
  Claimed: (
    <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-icon" />
  ),
  Cancelled: (
    <FaTimesCircle className="text-red-500 text-6xl mb-4 animate-icon" />
  ),
  "On the way": (
    <FaTruck className="text-blue-500 text-6xl mb-4 animate-icon" />
  ),
  "On The Way": (
    <FaTruck className="text-blue-500 text-6xl mb-4 animate-icon" />
  ),
};

function Status() {
  const { orderid, userid } = useParams();
  const [stat, setStat] = useState("Loading");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);
  const { orders, customers, status } = useContext(DataContext);

  useEffect(() => {
    // Animation on render
    const icon = document.querySelector(".animate-icon");
    if (icon) {
      icon.classList.add("bounceIn");
    }

    // Verify if IDs exist
    const verifyIds = () => {
      const order = orders.find((order) => order.uid === orderid);
      const userExists = customers.some((customer) => customer.uid === userid);

      if (order && userExists) {
        setStat(order.status);
        setDesc(() => {
          return status.find((st) => st.status === order.status)?.description;
        });
        setError(null);
      } else {
        setStat("Invalid");
        setError("Invalid Order ID or User ID.");
      }
    };

    verifyIds();
  }, [orderid, userid, orders, customers]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <FaTimesCircle className="text-red-500 text-6xl mb-4 animate-icon" />
        <h1 className="text-3xl font-bold mb-2">Error!</h1>
        <p className="text-lg text-gray-700">{error}</p>
      </div>
    );
  }

  if (stat === "Loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <FaSpinner className="text-yellow-500 text-6xl mb-4 animate-icon" />
        <h1 className="text-3xl font-bold mb-2">Loading...</h1>
        <p className="text-lg text-gray-700">
          Please wait while we verify your information.
        </p>
      </div>
    );
  }

  const currentStatus =
    orders.find((order) => order.uid === orderid)?.status || "Pending";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {statusIcons[currentStatus] || (
        <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-icon" />
      )}
      <h1 className="text-3xl font-bold mb-2">{currentStatus}</h1>
      <p className="text-lg text-center text-gray-700">{desc}</p>
      <p className="text-md text-center text-gray-500">Order ID: {orderid}</p>
    </div>
  );
}

export default Status;
