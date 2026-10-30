import { useSelector } from "react-redux";
import { selectAuthUser } from "../redux/selectors";
import React, { useCallback, useEffect, useState } from "react";
import PatientAppointments from "../components/PatientDashboard/PatientAppointments";
import HeaderCard from "../components/DoctorDashboard/HeaderCard";
import { Calendar, FileText, History, Stethoscope } from "lucide-react/dist/cjs/lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PatientViewCard from "../components/Card/PatientViewCard";
import { toast } from 'react-toastify';

const PatientDashboard = () => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const reduxUser = useSelector(selectAuthUser);
  // Redux is the source of truth; fall back to storage only on a fresh page load.
  const userData =
    reduxUser ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem("userData"));
      } catch {
        return null;
      }
    })();
  const patientId = userData?._id || userData?.id;

  const handleViewMedicalHistory = () => {
    if (patientId) {
      navigate(`/medical-summary/${patientId}`);
    } else {
      toast.warning("Patient ID not found!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const fetchDetails = useCallback(async () => {
    if (!patientId) {
      return;
    }
    try {
      const res = await api.get(`/api/patient/${patientId}`);
      console.log(res.data);
      if (res.data?.success) {
        setPatientDetails(res.data?.patient);
      } else {
        toast("Something went wrong ! Please login");
        navigate(`/`);
      }
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  }, [patientId, navigate]);

  useEffect(() => {
    patientId && fetchDetails();
  }, [patientId, fetchDetails]);

  // Real dashboard counts (upcoming/past appointments + medical records).
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/api/stats/summary");
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const patientCards = [
    {
      number: stats ? String(stats.upcoming) : "–",
      description: "Total number of Upcoming Appointments",
      icon: Calendar,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      number: stats ? String(stats.past) : "–",
      description: "Total number of all the past Appointments",
      icon: History,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      number: stats ? String(stats.reports) : "–",
      description: "Total numbers of available medical Records",
      icon: FileText,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="flex flex-col md:px-3 lg:px-5 rounded-2xl">
      <div
        className="my-2 mt-7 lg:my-5 mx-3 lg:mx-5 flex flex-col sm:flex-row justify-between 
      items-start sm:items-center gap-4"
      >
        <div>
          {console.log(patientDetails)}
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-600">
            Welcome, {patientDetails?.name}
          </h1>
          <p>
            {patientDetails?.description ||
              "Here's a summary of your health journey."}{" "}
          </p>
        </div>

        <button
          onClick={handleViewMedicalHistory}
          className="flex items-center justify-center gap-2 bg-green-500 text-white 
          px-4 py-2 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto
          hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Stethoscope size={18} />
          <span>Medical History</span>
        </button>
      </div>

      <HeaderCard cards={patientCards} className={"lg:ml-1"} />
      {patientDetails && (
        <PatientViewCard
          patient={patientDetails}
          setPatientDetails={setPatientDetails}
        />
      )}
      <div className="flex flex-col items-center w-full">
        <PatientAppointments />
      </div>
    </div>
  );
};

export default PatientDashboard;
