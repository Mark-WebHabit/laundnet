import React, { useContext } from "react";
import { Link } from "react-scroll";
import { Link as Lk, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataStore";

function Header() {
  const { user } = useContext(DataContext);

  return (
    <div
      role="header"
      className="h-[80px] w-full fixed bg-white/10 top-0 left-0 z-20 flex items-center justify-between px-4"
    >
      <h1 className="text-white text-2xl ">LAUNDNET</h1>

      <ul
        role="nav"
        className=" flex gap-4 text-red-800 text-[18px] cursor-pointer "
      >
        <li className=" transition-all duration-200 hover:text-white">
          <Link to="home" smooth={true} duration={200}>
            Home
          </Link>
        </li>
        <li className=" transition-all duration-200 hover:text-white">
          <Link to="services" smooth={true} duration={200}>
            Services
          </Link>
        </li>
        <li className=" transition-all duration-200 hover:text-white">
          <Link to="contact" smooth={true} duration={200}>
            Contact
          </Link>
        </li>
        <li className=" transition-all duration-200 hover:text-white">
          {user ? (
            <Lk to={`${user.isAdmin ? "/admin" : "/user"}`}>Main</Lk>
          ) : (
            <Lk to="/auth">Login</Lk>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Header;
