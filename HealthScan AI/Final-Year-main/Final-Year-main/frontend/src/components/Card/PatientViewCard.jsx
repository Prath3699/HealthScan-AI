import { PencilIcon, Save } from "lucide-react";
import React, { useEffect, useState } from "react";

const PatientViewCard = ({ patient, accessedBy, setPatientDetails }) => {
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    setPatientData(patient);
  }, []);
  const changeHandler = (value, updateKey) => {
    setPatientData((prev) => {
      const newObj = { ...prev };
      const keys = updateKey.split(".");
      let obj = newObj;

      keys.slice(0, -1).forEach((key) => {
        obj[key] = { ...obj[key] };
        obj = obj[key];
      });

      obj[keys[keys.length - 1]] = value;
      return newObj;
    });
  };

  const handleSave = () => {
    setPatientDetails(patientData);
  };

  const [isEditEnable, setEditEnable] = useState(false);
  return (
    <div className="flex flex-col py-3 px-4 mt-2 mb-4 rounded-lg shadow bg-white border border-gray-200">
      <div className="flex flex-row justify-between py-2 px-2">
        <h1 className="text-2xl max-sm:text-lg font-semibold">My Profile </h1>
        <div className="flex flex-row gap-3">
          <div className="flex items-center gap-1">
            <div
              onClick={() => {
                setEditEnable((prev) => {
                  return !prev;
                });
              }}
              className="p-2 bg-blue-200 cursor-pointer rounded-full"
            >
              <PencilIcon className="w-6 h-6 text-blue-500" />
            </div>
            Edit
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={!isEditEnable}
              onClick={() => handleSave()}
              className="p-2 rounded-full cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed bg-green-200"
            >
              <Save className="w-6 h-6 text-green-500" />
            </button>
            Save{" "}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 mx-4 p-3 gap-2 my-3">
        <div className="flex flex-col text-lg font-sans justify-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="">Name :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => changeHandler(e.target.value, "name")}
                value={patientData?.name || ""}
              />
            ) : (
              <h1>{patientData?.name}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Age :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "age");
                }}
                value={patientData?.age}
              ></input>
            ) : (
              <h1>{patientData?.age}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Email :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "email");
                }}
                value={patientData?.email}
              ></input>
            ) : (
              <h1>{patientData?.email}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Gender :</h1>
            {isEditEnable ? (
              <select
                className="w-auto py-1 px-2 border rounded-lg border-blue-300
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => changeHandler(e.target.value, "gender")}
                value={patientData?.gender || ""}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <h1>{patientData?.age}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Phone No :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => changeHandler(e.target.value, "phone")}
                type="number"
                value={patientData?.phone || ""}
              />
            ) : (
              <h1>{patientData?.phone}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Blood Group :</h1>
            {isEditEnable ? (
              <select
                className="w-auto py-1 px-2 border rounded-lg border-blue-300
             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => changeHandler(e.target.value, "bloodGroup")}
                value={patientData?.bloodGroup || ""}
              >
                <option value="" disabled>
                  Select Blood Group
                </option>

                <option value="A+">A+ve</option>
                <option value="A-">A-ve</option>
                <option value="B+">B+ve</option>
                <option value="B-">B-ve</option>
                <option value="AB-">AB-ve</option>
                <option value="AB+">AB+ve</option>
                <option value="O+">O+ve</option>
                <option value="O-">O-ve</option>
              </select>
            ) : (
              <h1>{patientData?.age}</h1>
            )}
          </div>
        </div>
        <div className="flex flex-col text-lg pl-2 font-sans justify-center max-sm:mt-2  gap-4">
          <h1 className="text-xl font-semibold">Address </h1>
          <div className="flex items-center gap-2">
            <h1>Street :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "address.street");
                }}
                value={patientData?.address?.street}
              ></input>
            ) : (
              <h1>{patientData?.address?.street}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>City :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "address.city");
                }}
                value={patientData?.address?.city}
              ></input>
            ) : (
              <h1>{patientData?.address?.city}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>State :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "address.state");
                }}
                value={patientData?.address?.state}
              ></input>
            ) : (
              <h1>{patientData?.address?.state}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Pincode :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "address.pincode");
                }}
                type="number"
                value={patientData?.address?.pincode}
              ></input>
            ) : (
              <h1>{patientData?.address?.pincode}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1>Country :</h1>
            {isEditEnable ? (
              <input
                className="w-[70%] h-5 p-4 border rounded-lg border-blue-300 
             focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e) => {
                  changeHandler(e.target.value, "address.pincode");
                }}
                type="text"
                value={patientData?.address?.country}
              ></input>
            ) : (
              <h1>{patientData?.address?.country}</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientViewCard;
