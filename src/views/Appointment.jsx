import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataStore";
import { ref, remove, update } from "firebase/database";
import { db } from "../../firebase";

function Appointment() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  const { appointments } = useContext(DataContext);

  // Filter appointments based on search and status filter
  const filteredAppointments = appointments.filter(
    ({ username, phone, date, time, status, purpose }) =>
      (filterStatus === "All" || status === filterStatus) &&
      (username?.toLowerCase()?.includes(search.toLowerCase()) ||
        phone?.toLowerCase()?.includes(search.toLowerCase()) ||
        date?.toLowerCase()?.includes(search.toLowerCase()) ||
        time?.toLowerCase()?.includes(search.toLowerCase()) ||
        status?.toLowerCase()?.includes(search.toLowerCase()) ||
        purpose?.toLowerCase()?.includes(search.toLowerCase()))
  );

  // Delete appointment function
  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm("Are you sure? This can't be undone");

      if (!confirm) return;

      const appointmentRef = ref(db, `appointments/${id}`);
      await remove(appointmentRef);
      alert("Successfully deleted");
    } catch (error) {
      console.error("Failed to delete appointment: " + error);
      alert("Delete Failed. Please try again");
    }
  };

  const handleUpdate = async (status, uid) => {
    try {
      const confirm = window.confirm("Are you sure? This can't be undone");

      if (!confirm) return;

      const appointmentRef = ref(db, `appointments/${uid}`);
      await update(appointmentRef, { status });
      alert("Successfully updated");
    } catch (error) {
      console.error("Failed to update appointment: " + error);
      alert("Update Failed. Please try again");
    }
  };

  return (
    <div className="flex-1 w-full p-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded mb-2 sm:mb-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["Pending", "Accepted", "Declined"].map((status) => (
            <button
              key={status}
              className={`px-3 py-1 border rounded ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } transition hover:bg-blue-700 hover:text-white`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(
                ({ uid, date, time, status, purpose, username, phone }) => (
                  <tr key={uid} className="border-b border-gray-200">
                    <td className="p-3">{username}</td>
                    <td className="p-3">{phone}</td>
                    <td className="p-3">{date}</td>
                    <td className="p-3">{time}</td>
                    <td
                      className={`p-3 font-semibold ${
                        status === "Accepted"
                          ? "text-green-600"
                          : status === "Declined"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {status}
                    </td>
                    <td className="p-3">{purpose}</td>
                    <td className="p-3 flex gap-1">
                      {status === "Declined" ? (
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                          onClick={() => handleDelete(uid)}
                        >
                          Delete
                        </button>
                      ) : (
                        <>
                          <button
                            className={`px-3 py-1 ${
                              status === "Accepted"
                                ? "bg-gray-500"
                                : "bg-green-500"
                            } text-white rounded ${
                              status === "Accepted"
                                ? "hover:bg-gray-700"
                                : "hover:bg-green-700"
                            } transition`}
                            onClick={() => handleUpdate("Accepted", uid)}
                            disabled={status === "Accepted"}
                          >
                            {status === "Accepted" ? "Accepted" : "Accept"}
                          </button>

                          {status !== "Accepted" && (
                            <button
                              className={`px-3 py-1 ${
                                status === "Accepted"
                                  ? "bg-gray-500"
                                  : "bg-red-500"
                              } text-white rounded ${
                                status === "Accepted"
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-red-700"
                              } transition`}
                              disabled={status === "Declined"}
                              onClick={() => handleUpdate("Declined", uid)}
                            >
                              Decline
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointment;
