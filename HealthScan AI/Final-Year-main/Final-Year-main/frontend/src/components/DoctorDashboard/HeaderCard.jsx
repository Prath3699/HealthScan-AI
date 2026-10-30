import React from "react";
import Card from "../Card/Card";

const HeaderCard = ({ cards, className }) => {
  return (
    <div className={` my-5 ${className}`}>
      <div className="grid gap-6  grid-cols-1 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card
            key={index}
            number={card.number}
            description={card.description}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderCard;
