import {
  Activity,
  ArrowBigRight,
  CircleAlert,
  ClipboardCheck,
  ClipboardList,
  Clock,
  MapPin,
  Pill,
  User,
  UtensilsCrossed,
} from "lucide-react";
import React, { useState } from "react";

const MedicalAI = () => {
  // Captures the form inputs so they survive re-renders; the values feed the
  // upcoming AI recommendation feature (see the Predict button below).
  const inputsRef = React.useRef({});
  const track = (key) => (e) => {
    inputsRef.current[key] = e.target.value;
  };

  // The AI recommendation result; populated once the prediction endpoint exists.
  const [result] = useState(null);
  return (
    <div className="mt-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <div className="text-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Smart HealthCare & Customised Medical Treatment Recommendation
        </h1>
        <p>Powered by Health Scan - AI Model </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2 mt-3 border-2 px-3 py-2 md:px-5 md:py-3 rounded-lg border-gray-200">
          <div>
            <label className="block mb-1 font-normal text-gray-700">
              Full Name :
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 ">
              <User className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                onChange={track("patientName")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2">
            <div>
              <label className="block mb-1 font-normal text-gray-700">
                Age :
              </label>
              <div className="flex items-center rounded-xl border border-gray-300 ">
                <Activity className="w-5 h-5 text-gray-500 mx-2" />
                <input
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  required
                  onChange={track("patientAge")}
                  className="w-full p-2.5 focus:outline-none rounded-r-xl"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-normal text-gray-700">
                Duration :
              </label>
              <div className="flex items-center rounded-xl border border-gray-300 ">
                <Clock className="w-5 h-5 text-gray-500 mx-2" />
                <input
                  name="duration"
                  type="number"
                  placeholder="Enter disease duration"
                  required
                  onChange={track("diseaseDuration")}
                  className="w-full p-2.5 focus:outline-none rounded-r-xl"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-normal text-gray-700">
              Enter your location :
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 ">
              <MapPin className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="location"
                type="text"
                placeholder="Enter your location"
                required
                onChange={track("patientLocation")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-normal text-gray-700">
              Enter Symptoms :
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 ">
              <ClipboardList className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="symptoms"
                type="text"
                placeholder="Enter your Symptoms"
                required
                onChange={track("patientSymptoms")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <button className="bg-green-400 flex my-3 justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
            Predict <ArrowBigRight className="w-5 h-5 text-white mx-2" />
          </button>
        </div>
        {result && (
          <div className="flex flex-col gap-2 px-4 py-3">
            <div className="grid grid-cols-1 gap-2">
              <button className="bg-green-400 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
                <ClipboardCheck className="w-5 h-5 text-white mx-2" />
                Description
              </button>
              <button className="bg-green-400 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
                <Pill className="w-5 h-5 text-white mx-2" />
                Medications
              </button>
              <button className="bg-green-400 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
                <CircleAlert className="w-5 h-5 text-white mx-2" />
                Precaution
              </button>
              <button className="bg-green-400 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
                <UtensilsCrossed className="w-5 h-5 text-white mx-2" /> Diets
              </button>
            </div>
            <button className="bg-green-400 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5">
              Print Report <ArrowBigRight className="w-5 h-5 text-white mx-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAI;
