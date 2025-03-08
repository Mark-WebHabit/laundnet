import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAP;

function Register() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const toggleRegisterType = () => {
    setIsCustomer(!isCustomer);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const fetchCoordinates = async () => {
    if (!formData.address && isCustomer) {
      alert("Please enter an address.");
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          formData.address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setCoordinates(location);
        setShowMap(true);
      } else {
        alert("Address not found. Please enter a valid address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to fetch location. Try again.");
    }
  };

  const handleConfirmAddress = async () => {
    setShowMap(false);
    handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!coordinates && isCustomer) {
      fetchCoordinates();
      return;
    }

    console.log(coordinates);

    if (!formData.username || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (isCustomer) {
      if (!formData.address || !formData.phone) {
        alert("Please fill in all customer details.");
        return;
      }

      const phonePattern = /^09\d{9}$/;
      if (!phonePattern.test(formData.phone)) {
        alert("Phone number must be an 11-digit number starting with 09.");
        return;
      }
    }

    try {
      const usersRef = ref(db, "users");

      // Check for duplicate username
      const usernameQuery = query(
        usersRef,
        orderByChild("username"),
        equalTo(formData.username)
      );
      const usernameSnapshot = await get(usernameQuery);
      if (usernameSnapshot.exists()) {
        alert("Username already exists. Please choose a different username.");
        return;
      }

      // Check for duplicate phone number
      const phoneQuery = ref(db, "users");
      const phoneSnapshot = await get(phoneQuery);
      const users = phoneSnapshot.val();
      for (let userId in users) {
        if (users[userId].phone === formData.phone) {
          alert(
            "Phone number already exists. Please use a different phone number."
          );
          return;
        }
      }

      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Generate a unique ID for the user
      const userId = uuidv4();

      const userRef = ref(db, `users/${userId}`);
      await set(userRef, {
        uid: userId,
        username: formData.username,
        password: hashedPassword,
        isAdmin: !isCustomer,
        ...(isCustomer && {
          address: formData.address,
          phone: formData.phone,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });

      alert("Registration successful!");
      navigate("/auth");
    } catch (error) {
      alert("An error occurred during registration. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {isCustomer ? "Customer Registration" : "Admin Registration"}
      </h2>
      <form onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
        />

        {isCustomer && (
          <>
            <Input
              id="address"
              label="Address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={fetchCoordinates}
              className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
            >
              Pin Location
            </button>
            <Input
              id="phone"
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </>
        )}

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>

      {showMap && coordinates && isCustomer && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-bold mb-2">Is this your location?</h3>
          <iframe
            title="User Location"
            width="100%"
            height="250"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}`}
          />
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setShowMap(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Re-enter Address
            </button>
            <button
              onClick={handleConfirmAddress}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={toggleRegisterType}
          className="text-blue-500 hover:text-blue-700 font-bold"
        >
          {isCustomer ? "Admin Registration" : "Customer Registration"}
        </button>
      </div>
    </div>
  );
}

export default Register;
