import React from "react";
import { allAppointment } from "../../../Constants/Doctor";

const AllAppointment = () => {
  return (
    <div className="flex flex-col items-center px-5 bg-white border border-gray-300 rounded-2xl mt-3 lg:mx-4">
      <h1 className="text-gray-700 text-2xl my-2 font-semibold">
        All Appointments
      </h1>
      <div className="overflow-x-auto max-w-full  w-full my-3 lg:my-8">
        <table className=" rounded-lg w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className=" px-2 py-2 text-left">Patient name</th>
              <th className=" px-2 py-2 text-left">Date & Time</th>
              <th className=" px-2 py-2 text-left">Status</th>
              <th className=" px-2 py-2 text-left">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {allAppointment.length == 0 && (
              <h1>Sorry No Appointments available</h1>
            )}
            {allAppointment.length > 0 &&
              allAppointment?.map((item, index) => (
                <tr key={index} className="bg-white border-b border-gray-300">
                  <td className=" px-3 py-2 font-medium text-gray-900 flex items-center gap-2">
                    <img
                      className="rounded-full w-8 h-8 ml-1.5"
                      src="https://cdn.pixabay.com/photo/2023/02/12/13/16/dog-7785066_1280.jpg"
                      alt="doctor profile"
                    />
                    <div className="flex flex-col">
                      <p className=" text-gray-600">
                        {item?.patientName.split(" ")[0]}{" "}
                      </p>
                      <p className=" text-gray-600">
                        {item?.patientName.split(" ")[1]}{" "}
                      </p>
                    </div>
                  </td>
                  <td className=" px-2 py-2">
                    {new Date(item?.dateTime)
                      .toString()
                      .split(" ")
                      .slice(0, 5)
                      .join(" ")}
                  </td>
                  <td className={`px-2 py-2`}>
                    <h1
                      className={`${
                        item?.status == "Cancelled"
                          ? "bg-red-400"
                          : item?.status == "Pending"
                          ? "bg-yellow-100"
                          : "bg-green-200"
                      } rounded-2xl text-center w-auto lg:w-1/2`}
                    >
                      {item?.status}{" "}
                    </h1>
                  </td>
                  <td className=" px-2 py-2">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointment;
