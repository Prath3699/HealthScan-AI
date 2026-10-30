import React, { useState } from "react";
import DoctorImage from "/IntroImage.png";
import DoctorSignup from "../components/Auth/DoctorSignUp";
import PatientSignup from "../components/Auth/PatientSignUp";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [role, setRole] = useState("doctor");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6">
          {/* Role Toggle Button */}
          <div className="flex justify-center gap-4 ">
            <button
              onClick={() => setRole("doctor")}
              className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${
                role === "doctor"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Doctor Signup
            </button>
            <button
              onClick={() => setRole("patient")}
              className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${
                role === "patient"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Patient Signup
            </button>
          </div>

          {role === "doctor" ? <DoctorSignup /> : <PatientSignup />}
          <div className="flex items-center justify-center ">
            <p>Already have an account?</p>
            <Link to="/login" className="ml-2 text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="w-full md:w-1/2 max-md:hidden">
          <img
            src={DoctorImage}
            alt="Doctor illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
