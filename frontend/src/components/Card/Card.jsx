import React from "react";

const Card = ({
  number,
  description,
  icon: Icon,
  iconBg = "bg-yellow-100",
  iconColor = "text-yellow-600",
}) => {
  return (
    <div className="flex items-center w-auto p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition">
      {/* Icon */}
      <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
        {Icon && <Icon size={26} />}
      </div>

      {/* Text */}
      <div className="ml-4">
        <h2 className="text-2xl font-bold text-gray-800">{number}</h2>
        <p className="text-md text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default Card;
