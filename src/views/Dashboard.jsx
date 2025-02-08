import React from "react";

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
  return (
    <div className=" w-full h-full flex justify-center items-center content-center flex-wrap gap-4 overflow-scroll">
      <DashBoardCard
        image={"sales"}
        title={"Weekly total sales"}
        value={"1200.00"}
      />
      <DashBoardCard
        image={"completed"}
        title={"Weekly completed laundry"}
        value={"80"}
      />
      <DashBoardCard
        image={"customer"}
        title={"Weekly total customer"}
        value={"20"}
      />
      <DashBoardCard
        image={"pending"}
        title={"pending laundries"}
        value={"20"}
      />
      <DashBoardCard
        image={"reservations"}
        title={"Total pending reservations"}
        value={"20"}
      />
      <DashBoardCard
        image={"inprogress"}
        title={"In-progress laundries"}
        value={"20"}
      />
      <DashBoardCard
        image={"customer"}
        title={"Total system clients"}
        value={"20"}
      />
    </div>
  );
}

export default Dashboard;
