import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Home.png')",
      }}
    >
      <div className="text-center text-white px-8 py-6">
        <h2 className="text-3xl font-bold mb-3">
          Empowering Your Health Journey
        </h2>
        <p className="mb-4">
          Welcome to HealthScan AI - where cutting-edge innovation meets
          compassionate care. Predict your health risks, book live appointments,
          and get AI-generated medical insights with ease.
        </p>
        <button className="px-6 py-3 bg-green-500 rounded-lg text-lg cursor-pointer font-medium
         hover:bg-green-600">
          Book an Appointment & Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
