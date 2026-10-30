import React from "react";
import HeroSection from "../components/Home/HeroSection";
import ServicesSection from "../components/Home/ServiceSection";
import AboutSection from "../components/Home/AboutSection";
import LatestNewsSection from "../components/Home/LatestNewsSection";
import FAQSection from "../components/Home/FAQSection";
import Search from "../components/Search/Search";

const HomePage = () => {
  return (
    <div className="font-sans flex flex-col ">
      <div className="flex p-4 my-3 md:mb-5 items-center md:mt-1 border rounded-lg border-gray-200 bg-white">
        <Search isPatientSearch={false} />
      </div>
      <div className="bg-gray-50 w-full flex flex-col  text-gray-800">
        <HeroSection />

        <ServicesSection />
        <AboutSection />
        <LatestNewsSection />
        <FAQSection />
      </div>
    </div>
  );
};

export default HomePage;
