import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataStore";

const DashBoardCard = ({ image, title, value, components = [] }) => {
  return (
    <div className="border  min-w-[200px] w-[30%] max-w-[300px] aspect-square flex flex-col justify-center items-center p-2 rounded-2xl transition-all duration-200 hover:scale-110 bg-inherit">
      <img
        src={`/images/dashboard/${image}.png`}
        alt="DB"
        className="w-[50%]"
      />
      <h2 className="text-red-800 text-4xl text-center">{value}</h2>
      <p className="text-[20px] text-center">{title}</p>
      {components.length > 0 &&
        components.map((Component, i) => <Component key={i} />)}
    </div>
  );
};

function Dashboard() {
  const [weeklyData, setWeeklyData] = useState([]);
  const { weekly } = useContext(DataContext);

  const { orders, customers } = useContext(DataContext);

  useEffect(() => {
    setWeeklyData(weekly);
  }, [weekly]);

  const pendingBlacklistStatus = [
    "Wash",
    "Dry",
    "Fold",
    "For Pick Up",
    "For Deliver",
    "On the way",
    "On The Way",
  ];

  return (
    <div className=" w-full h-full flex justify-center items-center content-center flex-wrap gap-4 overflow-scroll">
      <DashBoardCard
        image={"sales"}
        title={"This week total sales"}
        value={weeklyData?.find((wk) => wk.isCurrentWeek)?.totalSales}
      />
      <DashBoardCard
        image={"completed"}
        title={"This week completed laundry"}
        value={
          weeklyData?.find((wk) => wk.isCurrentWeek)?.numDeliveredOrClaimed
        }
      />
      <DashBoardCard
        image={"customer"}
        title={"This week completed customer"}
        value={weeklyData?.find((wk) => wk.isCurrentWeek)?.numOrders}
      />
      <DashBoardCard
        image={"pending"}
        title={"pending laundries"}
        value={orders?.filter((ord) => ord.status === "Preparing")?.length || 0}
      />
      <DashBoardCard
        image={"reservations"}
        title={"Total pending reservations"}
        value={orders?.filter((ord) => ord.status === "Pending")?.length || 0}
      />
      <DashBoardCard
        image={"inprogress"}
        title={"In-progress laundries"}
        value={
          orders?.filter((ord) => pendingBlacklistStatus.includes(ord.status))
            ?.length || 0
        }
      />
      <DashBoardCard
        image={"customer"}
        title={"Total system clients"}
        value={customers?.length || 0}
      />
    </div>
  );
}

export default Dashboard;
