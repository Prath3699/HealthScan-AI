import { useSelector } from "react-redux";
import { selectAuthUser } from "../redux/selectors";
import React, { useCallback, useEffect, useState } from "react";
import DoctorIntro from "../components/Appointment/DoctorIntro";
import api from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentPicker from "../components/Appointment/AppointmentPicker";
import { Loader } from "lucide-react";

const View = () => {
  const { doctorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [doctorDetails, setDoctorDetails] = useState(null);
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!patientId) {
      toast("Please login to book an appointment !");
      navigate("/");
    }
  }, [patientId, navigate]);
  const fetchDoctorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/doctors/${doctorId}`);
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
  }, [doctorId]);
  console.log(doctorDetails);

  useEffect(() => {
    fetchDoctorDetails();
  }, [fetchDoctorDetails]);

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
