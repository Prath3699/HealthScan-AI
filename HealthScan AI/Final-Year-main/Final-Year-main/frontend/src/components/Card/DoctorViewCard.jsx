import { MapPin, PhoneCallIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorViewCard = ({ doctor, onCompletion }) => {
  const navigate = useNavigate();

  const handleSelectedDoctor = (e) => {
    e.preventDefault();
    onCompletion();
    navigate(`/view/doctors/${doctor?._id}`);
  };
  return (
    <div
      onClick={handleSelectedDoctor}
      className="px-4 py-2 border cursor-pointer shadow-lg border-gray-200 flex rounded-lg justify-between items-center"
    >
      <div className="flex items-center w-auto justify-between md:justify-normal gap-3">
        {doctor?.profilePic ? (
          <img
            src={doctor.profilePic}
            className="w-15 h-15 max-sm:w-9 max-sm:h-9  rounded-full"
          ></img>
        ) : (
          <div className="p-4 bg-green-300 rounded-full text-white text-2xl font-bold">
            {doctor?.name[0]}{" "}
          </div>
        )}
        <div className="flex flex-col ">
          <h1 className="max-sm:text-lg text-xl font-medium">
            Dr. {doctor?.name}{" "}
          </h1>
          <p className="max-sm:text-sm">
            Experience : {doctor?.experience} Yrs
          </p>
          <p> Specialization : {doctor?.specialization} </p>
        </div>
      </div>
      <div className="max-sm:hidden flex flex-col gap-2">
        <h1 className="flex gap-2 text-sm md:text-xl max-sm:text-lg">
          <PhoneCallIcon className="w-auto text-blue-500 h-auto" />{" "}
          {doctor?.phone}{" "}
        </h1>
        <h1 className="flex gap-2">
          <MapPin className="w-auto text-yellow-500 h-auto" />{" "}
          {doctor?.location?.city}{" "}
        </h1>
      </div>
    </div>
  );
};

export default DoctorViewCard;
