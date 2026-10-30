import React from "react";
import SearchDisease from "../components/Disease/Search";
import { PlusIcon, Trash } from "lucide-react";
import PatientTimeline from "../components/Disease/PatientTimeline";

const DiseaseManagement = () => {
  const diseaseList = [
    { name: "Diaheria", symptions: "Fatigue" },
    { name: "Diaheria", symptions: "Fatigue" },
    { name: "Diaheria", symptions: "Fatigue" },
    { name: "Diaheria", symptions: "Fatigue" },
    { name: "Diaheria", symptions: "Fatigue" },
  ];
  return (
    <div className="bg-white h-full py-2 px-4">
      <h1 className="text-2xl">Disease Management</h1>
      <div className="w-full flex flex-col md:flex-row">
        <div className="mt-3 lg:mt-7 mx-2 border w-full lg:w-[70%] rounded-lg p-2 border-gray-200">
          <SearchDisease />
          <div className="flex flex-col my-4 mx-3">
            <h1 className="text-xl text-gray-700">Current Diagnosis</h1>
            <div className="w-full flex flex-col gap-2 my-2 lg:my-4">
              {diseaseList?.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full px-3 lg:px-5 items-center border rounded-lg border-gray-200 flex-row justify-between"
                >
                  <div className="flex flex-col py-2 gap-1 ml-3">
                    <h1>{item.name} </h1>
                    <p>Symptoms : {item.symptions}</p>
                  </div>
                  <Trash className="text-red-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 lg:mt-7 mx-2 w-full lg:w-[30%] border flex flex-col gap-2 rounded-lg py-2 px-4 border-gray-200">
          <span className="flex my-3 items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0156 4C18.5469 4 19 4.20312 19.375 4.60938C19.7812 4.98438 19.9844 5.45312 19.9844 6.01562V18.0156C19.9844 18.5469 19.7812 19.0156 19.375 19.4219C19 19.7969 18.5469 19.9844 18.0156 19.9844H1.98438C1.45312 19.9844 0.984375 19.7969 0.578125 19.4219C0.203125 19.0156 0.015625 18.5469 0.015625 18.0156V6.01562C0.015625 5.45312 0.203125 4.98438 0.578125 4.60938C0.984375 4.20312 1.45312 4 1.98438 4H6.01562V1.98438C6.01562 1.45313 6.20312 1 6.57812 0.625C6.98438 0.21875 7.45312 0.015625 7.98438 0.015625H12.0156C12.5469 0.015625 13 0.21875 13.375 0.625C13.7812 1 13.9844 1.45313 13.9844 1.98438V4H18.0156ZM7.98438 1.98438V4H12.0156V1.98438H7.98438ZM13.9844 13V10.9844H10.9844V7.98438H9.01562V10.9844H6.01562V13H9.01562V16H10.9844V13H13.9844Z"
                fill="#2563EB"
              />
            </svg>
            Symptom Checker :
          </span>
          <div className="flex flex-col my-3 w-full">
            <label
              htmlFor="password1"
              className="mb-2 block text-xl text-gray-700"
            >
              Patient Symptoms
            </label>
            <div className="flex items-center w-full rounded-lg border p-1 border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Search Disease"
                className="w-full p-1   focus:outline-none"
              />
            </div>
          </div>
          <span className="ml-2">Potential Diseases</span>
          <div className="mt-3 mx-3 flex flex-col gap-2">
            {diseaseList?.map((item, index) => (
              <div
                key={index}
                className="flex w-full px-3 lg:px-5 items-center border rounded-lg border-gray-200 flex-row justify-between"
              >
                <div className="flex flex-col py-1 gap-1">
                  <h1>{item.name} </h1>
                  <p>Symptoms : {item.symptions}</p>
                </div>
                <div className="bg-blue-200 cursor-pointer flex flex-row text-blue-700 px-2 py-2 rounded-full">
                  <PlusIcon /> Add
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col md:flex-row gap-4">
        <div className="border mt-3 lg:w-[70%] rounded-lg px-4 lg:px-6 py-2 border-gray-200">
          <PatientTimeline />
        </div>
        <div className="border h-fit mt-3 w-full md:w-[30%] border-gray-200 px-4 py-2 rounded-lg">
          <h1 className="flex flex-row gap-4 my-2 items-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2188 7.98438H13.9844V13.9844H11.2188V7.98438ZM5.59375 0.015625H8.40625V13.9844H5.59375V0.015625ZM0.015625 4.1875H3.01562V13.9844H0.015625V4.1875Z"
                fill="#2563EB"
              />
            </svg>{" "}
            Quick Stats
          </h1>
          <div className="grid grid-cols-3 mt-3">
            <div className="flex flex-col items-center">
              <h1 className="text-green-400 text-xl font-medium">12</h1>
              <span className="text-sm">Active Case</span>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-green-400 text-xl font-medium">12</h1>
              <span className="text-sm">Active Case</span>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-green-400 text-xl font-medium">12</h1>
              <span className="text-sm">Active Case</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseManagement;
