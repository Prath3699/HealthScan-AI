import React, { useEffect, useState } from "react";
import DoctorIntro from "../components/Appointment/DoctorIntro";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentPicker from "../components/Appointment/AppointmentPicker";
import { Loader } from "lucide-react";

const View = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const patientId = userData?._id || userData?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) {
      toast("Please login to book an appointment !");
      navigate("/");
    }
  }, []);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`);
      console.log(res.data);
      if (res.data) {
        setDoctorDetails(res.data);
      } else {
        toast(res.data?.message || "Something went wrong try again !");
      }
    } catch (error) {
      toast(error?.message || "Something went wrong try again !");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(doctorDetails);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex items-center w-full gap-2 justify-center mt-2 text-xl md:text-2xl text-blue-500">
        <Loader className="animate-spin" /> Loading....
      </div>
    );
  }
  return (
    <div>
      <DoctorIntro doctor={doctorDetails} />
      <AppointmentPicker doctorId={doctorDetails?._id} />
    </div>
  );
};

export default View;
