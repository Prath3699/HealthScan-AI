import React from "react";

const LatestNewsCard = ({ img, title, desc }) => {
  return (
    <div
      className="flex flex-col p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition 
    duration-300 cursor-pointer"
    >
      <img
        src={img}
        alt={title}
        className="rounded-lg mb-4 w-full h-48 object-cover shadow-sm"
      />
      <div className="text-center md:text-left">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
        <p className="text-blue-500 text-sm">{desc}</p>
      </div>
    </div>
  );
};

export default LatestNewsCard;
