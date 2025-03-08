import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataStore";
import { ref, push, remove } from "firebase/database";
import { db } from "../../firebase";

// Format time as "10:00 AM"
function formatTime(hour) {
  const numHour = parseInt(hour, 10);
  const period = numHour >= 12 ? "PM" : "AM";
  const formattedHour = numHour % 12 === 0 ? 12 : numHour % 12; // Convert 24-hour to 12-hour format
  return `${formattedHour}:00 ${period}`;
}

const isTimeTaken = (state, date, hours) => {
  const selectedDate = state?.filter((dt) => dt.date === date);

  const time = formatTime(hours);

  const isExist = selectedDate?.find((t) => t.time === time);

  return isExist ?? false;
};

function UserAppointment() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    purpose: "",
  });
  const [appointments, setAppointments] = useState([]);
  const { appointments: apptmnts, user } = useContext(DataContext);

  useEffect(() => {
    if (!user || !user?.uid) {
      setAppointments([]);
      return;
    }

    const myAppointments = apptmnts.filter((apt) => apt.userId === user.uid);

    setAppointments(myAppointments);
  }, [apptmnts]);

  const handleInputChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (e) => {
    setNewAppointment({
      ...newAppointment,
      time: e.target.value, // Store the raw hour number (0-23)
    });
  };
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

  const handleSchedule = () => {
    if (!user || !user?.uid) {
      return;
    }

    const appointMentRef = ref(db, `appointments`);

    push(appointMentRef, {
      userId: user?.uid || "unknown", // Store user ID
      date: newAppointment.date,
      time: formatTime(newAppointment.time),
      purpose: newAppointment.purpose,
      status: "Pending", // Default status
    })
      .then(() => {
        console.log("Appointment scheduled successfully!");
        setIsModalOpen(false);
        setNewAppointment({ date: "", time: "", purpose: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Error scheduling appointment:", error);
        alert("Failed to set appointment");
      });
  };

  const filteredAppointments = appointments.filter(
    ({ date, time, status, purpose }) =>
      date.toLowerCase().includes(search.toLowerCase()) ||
      time.toLowerCase().includes(search.toLowerCase()) ||
      status.toLowerCase().includes(search.toLowerCase()) ||
      purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 w-full max-w-[1000px] p-4">
      {/* Search and Schedule Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded mb-2 sm:mb-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Schedule
        </button>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
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
                ({ uid, date, time, status, purpose }) => (
                  <tr key={uid} className="border-b border-gray-200">
                    <td className="p-3">{date}</td>
                    <td className="p-3">{time}</td>
                    <td
                      className={`p-3 font-semibold ${
                        status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status}
                    </td>
                    <td className="p-3">{purpose}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(uid)}
                        className={`px-3 py-1 ${
                          status === "Accepted" ? "bg-gray-500" : "bg-red-500"
                        } text-white rounded ${
                          status === "Accepted"
                            ? "hover:bg-gray-700"
                            : "hover:bg-red-700"
                        } transition`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Scheduling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Schedule Appointment</h2>

            {/* Date Picker */}
            <label className="block mb-2">Select Date:</label>
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split("T")[0]}
              value={newAppointment.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            {/* Time Picker (Only Hours) */}
            <label className="block ">Select Time (Hour Only):</label>
            <small className="text-red-600">Select date first</small>
            <select
              name="time"
              value={newAppointment.time} // This should be the raw hour value (0-23)
              onChange={handleTimeChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              disabled={!newAppointment.date}
            >
              <option value="">Select Hour</option>
              {[...Array(24)].map((_, index) => {
                const disbaled = isTimeTaken(
                  apptmnts,
                  newAppointment.date,
                  index
                );

                return (
                  <option
                    key={index}
                    value={index}
                    className={`${disbaled ? "text-red-700" : "text-black"}`}
                    disabled={disbaled}
                  >
                    {formatTime(index)} {/* Display formatted time */}
                  </option>
                );
              })}
            </select>
            {/* Purpose Input */}
            <label className="block mb-2">Purpose:</label>
            <input
              type="text"
              name="purpose"
              value={newAppointment.purpose}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={
                  !newAppointment.date ||
                  !newAppointment.time ||
                  !newAppointment.purpose
                }
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAppointment;
