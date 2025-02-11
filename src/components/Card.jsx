import React from "react";

const Card = ({ image, title, body }) => {
  return (
    <div className="card min-w-[250px] w-[20%] aspect-square border border-[rgba(0,0,0,0.3)] rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-200 hover:scale-110">
      <img
        src={`/images/${image}.png`}
        alt="Serice"
        className="w-[30%] min-w-[50px]"
      />
      <p className="text-xl text-red-700">{title}</p>
      <small className="text-center text-[15px]">{body}</small>
    </div>
  );
};

export default Card;
