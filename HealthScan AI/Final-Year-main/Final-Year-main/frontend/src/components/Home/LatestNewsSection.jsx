import React from "react";
import LatestNewsCard from "../Card/LatestNewsCard";

const LatestNewsSection = () => {
  return (
    <div className="py-12 px-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
        Latest News & Updates
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <LatestNewsCard
          img="/Chemistry.png"
          title="Breakthrough in Cancer Research"
          desc="Researchers announce a promising new therapy for cancer treatment."
        />

        <LatestNewsCard
          img="/Heart.png"
          title="New Guidelines for Heart Health"
          desc="Updated recommendations for maintaining cardiovascular health."
        />

        <LatestNewsCard
          img="/Yoga.png"
          title="Mental Wellness in the Workplace"
          desc="Strategies for promoting mental health and well-being in the workplace."
        />
      </div>
    </div>
  );
};

export default LatestNewsSection;
