import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// screens
import Main from "./views/Main";
import Auth from "./layout/Auth";
import Login from "./views/Login";
import Register from "./views/Register";

import Admin from "./layout/Admin";
import Dashboard from "./views/Dashboard";
import Customers from "./views/Customers";
import Services from "./views/Services";
import Appointments from "./views/Appointments";
import Sales from "./views/Sales";

import User from "../src/layout/User";
import UserTransactions from "./views/UserTransactions";
import Book from "./views/Book";
import Prices from "./views/Prices";

import Status from "./views/Status";

// context
import DataStore from "./context/DataStore";

function App() {
  return (
    <DataStore>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="services" element={<Services />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="sales" element={<Sales />} />
          </Route>

          <Route path="/user" element={<User />}>
            <Route index element={<UserTransactions />} />
            <Route path="reservation" element={<Book />} />
            <Route path="prices" element={<Prices />} />
          </Route>

          <Route path="/booked/:orderid/:userid" element={<Status />} />
        </Routes>
      </Router>
    </DataStore>
  );
}

export default App;
