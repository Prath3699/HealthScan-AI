import React from "react";
import { Activity, CalendarDays, FileText } from "lucide-react";
import ServiceCard from "../Card/ServiceCard";

const ServicesSection = () => {
  return (
    <div className="py-12 px-6">
      <p className="text-2xl text-center font-bold text-gray-800 mb-6">
        Our Services
      </p>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Comprehensive Healthcare Solutions
      </h2>
      <p className="text-gray-600 mb-8">
        Explore our integrated services designed to provide personalized and
        proactive healthcare.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard
          icon={<Activity className="h-6 w-6 text-green-600" />}
          title="Disease Prediction AI"
          desc="Utilize our AI to predict potential health risks and receive early warnings 
          tailored to your health profile."
          bg="bg-green-50"
        />

        <ServiceCard
          icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
          title="Live Appointment"
          desc="Schedule and manage live appointments with healthcare professionals via secure 
          video and chat consultations."
          bg="bg-blue-50"
        />

        <ServiceCard
          icon={<FileText className="h-6 w-6 text-indigo-600" />}
          title="Report Generation"
          desc="Generate clear, shareable health reports with AI-insights to track progress 
          and support clinician decisions."
          bg="bg-indigo-50"
        />
      </div>
    </div>
  );
};

export default ServicesSection;
