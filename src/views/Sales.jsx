import React, { useContext, useEffect, useState } from "react";

import Daily from "./DailySales";
import MonthlySales from "./MonthlySales";
import YearlySales from "./YearlySales";
import { DataContext } from "../context/DataStore";
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

const groupByDay = (data) => {
  const groupedData = data.reduce((acc, curr) => {
    if (curr.status === "Claimed" || curr.status === "Delivered") {
      const date = curr.monthDay + " " + curr.year; // Include the year in the date
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += curr.overAllTotal;
    }
    return acc;
  }, {});

  const result = Object.keys(groupedData).map((date) => ({
    date,
    totalSales: groupedData[date],
  }));

  // Sort the result in descending order by date
  result.sort((a, b) => new Date(b.date) - new Date(a.date));

  return result;
};

const groupByMonth = (data) => {
  const groupedData = data.reduce((acc, curr) => {
    if (curr.status === "Claimed" || curr.status === "Delivered") {
      const monthYear = curr.monthDay.split(" ")[0] + " " + curr.year; // Use month and year for grouping
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += curr.overAllTotal;
    }
    return acc;
  }, {});

  const result = Object.keys(groupedData).map((monthYear) => ({
    date: monthYear,
    totalSales: groupedData[monthYear],
  }));

  // Sort the result in descending order by date
  result.sort((a, b) => new Date(a.date) - new Date(b.date));

  return result;
};

const groupByYear = (data) => {
  const groupedData = data.reduce((acc, curr) => {
    if (curr.status === "Claimed" || curr.status === "Delivered") {
      const year = curr.year; // Use year for grouping
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += curr.overAllTotal;
    }
    return acc;
  }, {});

  const result = Object.keys(groupedData).map((year) => ({
    year,
    totalSales: groupedData[year],
  }));

  // Sort the result in descending order by year
  result.sort((a, b) => b.year - a.year);

  return result;
};

function Sales() {
  const [page, setPage] = useState(0);
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  const { orders } = useContext(DataContext);

  useEffect(() => {
    if (!orders?.length) {
      setDaily([]);
      setMonthly([]);
      setYearly([]);
    } else {
      setDaily(groupByDay(orders));
      setMonthly(groupByMonth(orders));
      setYearly(groupByYear(orders));
    }
  }, [orders]);

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

      {page === 0 ? (
        <Daily daily={daily} />
      ) : page === 1 ? (
        <MonthlySales monthly={monthly} />
      ) : (
        <YearlySales yearly={yearly} />
      )}
    </div>
  );
}

export default Sales;
