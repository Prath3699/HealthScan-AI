import React from "react";
import { Phone, Mail, MapPin, Briefcase, HeartPulse } from "lucide-react";

const DoctorIntro = ({ doctor }) => {
  return (
    <div className="flex flex-col items-center pb-12 border-b border-gray-400">
      {/* Top Image */}
      <div className="w-full h-96">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="Doctor"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col items-center space-x-4 p-3 lg:p-6 md:flex-row justify-between mt-6 rounded-lg gap-12 border bg-white border-gray-300">
        {/* LeftDetails */}
        <div className="ml-15 px-8 md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">Dr. {doctor?.name} </h1>
          <p className="text-lg text-gray-700">
            {doctor?.description ? (
              doctor?.description
            ) : (
              <>
                PureVital Medical is a modern clinic offering fast and easy
                online booking for essential health services. From checkups to
                tests, we help you take care of your health without the wait.
              </>
            )}
          </p>
        </div>

        {/* Right: Details */}
        <div className="ml-10  md:w-1/2 space-y-2 text-lg p-3 text-gray-800 border-t pt-4 lg:border-l lg:pl-4 lg:border-t-0 border-gray-300">
          <p className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />{" "}
            <span className="font-semibold">Specialty:</span>{" "}
            {doctor?.specialization}
          </p>
          <p className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            <span className="font-semibold">Experience:</span>{" "}
            {doctor?.experience} years
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />{" "}
            <span className="font-semibold">Location:</span>{" "}
            {doctor?.location?.city + "," + doctor?.location?.state}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />{" "}
            <span className="font-semibold">Phone:</span> {doctor?.phone}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Email:</span> {doctor?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorIntro;
