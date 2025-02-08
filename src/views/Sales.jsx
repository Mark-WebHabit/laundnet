import React, { useState } from "react";

import Daily from "./DailySales";
import MonthlySales from "./MonthlySales";
import YearlySales from "./YearlySales";
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

function Sales() {
  const [page, setPage] = useState(0);
  return (
    <div className=" w-full h-full overflow-scroll">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <Page
          isActive={page === 0}
          index={0}
          setPage={setPage}
          text={"Daily"}
        />
        <Page
          isActive={page === 1}
          index={1}
          setPage={setPage}
          text={"Monthly"}
        />
        <Page
          isActive={page === 2}
          index={2}
          setPage={setPage}
          text={"Yearly"}
        />
      </div>

      {page === 0 ? <Daily /> : page === 1 ? <MonthlySales /> : <YearlySales />}
    </div>
  );
}

export default Sales;
