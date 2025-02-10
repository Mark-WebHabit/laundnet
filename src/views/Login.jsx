import React, { useContext, useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import bcrypt from "bcryptjs";
import { db } from "../../firebase";
import { DataContext } from "../context/DataStore";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(DataContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const usersRef = ref(db, "users");

      // Check for user with the provided username
      const usernameQuery = query(
        usersRef,
        orderByChild("username"),
        equalTo(formData.username)
      );
      const usernameSnapshot = await get(usernameQuery);

      if (!usernameSnapshot.exists()) {
        alert("Invalid username or password.");
        return;
      }

      const userData = Object.values(usernameSnapshot.val())[0];

      // Check password
      const isPasswordValid = await bcrypt.compare(
        formData.password,
        userData.password
      );
      if (!isPasswordValid) {
        alert("Invalid username or password.");
        return;
      }

      // Save session to localStorage
      const userSession = {
        uid: userData.uid,
        username: userData.username,
        isAdmin: userData.isAdmin,
      };
      localStorage.setItem("user", JSON.stringify(userSession));

      // Update user state in DataStore
      setUser(userSession);

      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <small className="text-blue-500 font-bold">
        <Link to={"/"}>Home</Link>
      </small>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("register")}
          className="text-blue-500 hover:text-blue-700 font-bold"
        >
          Create an account?
        </button>
      </div>
    </div>
  );
}

export default Login;
