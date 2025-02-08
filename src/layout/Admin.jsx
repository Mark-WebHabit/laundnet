import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { DataContext } from "../context/DataStore";

function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(DataContext);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!user.isAdmin) {
      navigate("/user");
      return;
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="h-screen w-screen flex relative">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 p-2 ml-16 md:ml-0">
        <Outlet />
      </div>
    </main>
  );
}

export default Admin;
