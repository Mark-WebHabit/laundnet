import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";

import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

function Register() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  const toggleRegisterType = () => {
    setIsCustomer(!isCustomer);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
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
      // Check for duplicate
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
      <div className="mt-4 text-center">
        <button
          onClick={toggleRegisterType}
          className="text-blue-500 hover:text-blue-700 font-bold"
        >
          {isCustomer ? "Admin Registration" : "Customer Registration"}
        </button>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/auth")}
          className="text-blue-500 hover:text-blue-700 font-bold"
        ></button>
      </div>
    </div>
  );
}

export default Register;
