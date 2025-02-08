import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ icon, text, isSidebarOpen, redirect }) => {
  return (
    <li
      className="p-4 hover:bg-gray-700 cursor-pointer flex items-center gap-4"
      onClick={redirect}
    >
      <img src={icon} alt={text} className="aspect-square h-[24px]" />
      {isSidebarOpen && text}
    </li>
  );
};

const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-gray-800 text-white h-screen transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      } fixed md:relative z-10`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Sidebar Content */}
      <div className="mt-4">
        <ul>
          <SidebarItem
            icon="/images/dashboard.png"
            text="Dashboard"
            isSidebarOpen={isSidebarOpen}
            redirect={() => navigate("")}
          />
          <SidebarItem
            icon="/images/customerservice.png"
            text="Customers"
            isSidebarOpen={isSidebarOpen}
            redirect={() => navigate("customers")}
          />
          <SidebarItem
            icon="/images/services.png"
            text="Services"
            isSidebarOpen={isSidebarOpen}
            redirect={() => navigate("services")}
          />
          <SidebarItem
            icon="/images/appointment.png"
            text="Appointment"
            isSidebarOpen={isSidebarOpen}
            redirect={() => navigate("appointments")}
          />
          <SidebarItem
            icon="/images/sales.png"
            text="Sales"
            isSidebarOpen={isSidebarOpen}
            redirect={() => navigate("sales")}
          />
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
