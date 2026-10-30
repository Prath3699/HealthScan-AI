import React from "react";

const ServiceCard = ({ icon, title, desc, bg }) => {
  return (
    <div
      className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center 
    hover:shadow-md transition duration-300 cursor-pointer"
    >
      <div
        className={`h-12 w-12 mx-auto mb-4 rounded-md flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <h3 className="text-gray-700 font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
};

export default ServiceCard;
