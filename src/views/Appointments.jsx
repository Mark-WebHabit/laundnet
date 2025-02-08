import React, { useState } from "react";

import Reservations from "./Reservations.jsx";
import InProcess from "./InProcess.jsx";
import Pickup from "./Pickup.jsx";
import Delivery from "./Delivery.jsx";
import Completed from "./Completed.jsx";
import WalkinModal from "../components/WalkinModal.jsx";

const Page = ({ isActive, index, setPage, text }) => {
  return (
    <p
      className={`cursor-pointer text-blue-500 font-bold text-md transition-all duration-100 pb-2 hover:border-b-4  select-none ${
        isActive && "border-b-4 text-red-700"
      }`}
      onClick={() => setPage(index)}
    >
      {text}
    </p>
  );
};

function Appointments() {
  const [page, setPage] = useState(0);
  const [addTransaction, setAddTransaction] = useState(false);
  return (
    <div className="w-full h-full flex flex-col">
      {addTransaction && <WalkinModal setAddTransaction={setAddTransaction} />}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <Page
          isActive={page === 0}
          index={0}
          setPage={setPage}
          text={"Reservations"}
        />
        <Page
          isActive={page === 1}
          index={1}
          setPage={setPage}
          text={"In-Process"}
        />
        <Page
          isActive={page === 2}
          index={2}
          setPage={setPage}
          text={"For Claim"}
        />
        <Page
          isActive={page === 3}
          index={3}
          setPage={setPage}
          text={"For Delivery"}
        />
        <Page
          isActive={page === 4}
          index={4}
          setPage={setPage}
          text={"Completed"}
        />
      </div>
      {page === 0 ? (
        <Reservations />
      ) : page === 1 ? (
        <InProcess setAddTransaction={setAddTransaction} />
      ) : page === 2 ? (
        <Pickup />
      ) : page === 3 ? (
        <Delivery />
      ) : page === 4 ? (
        <Completed />
      ) : null}
    </div>
  );
}

export default Appointments;
