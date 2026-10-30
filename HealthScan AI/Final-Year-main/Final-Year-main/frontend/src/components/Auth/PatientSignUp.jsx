import React, { useState } from "react";
import {
  Mail,
  KeyRound,
  Phone,
  User,
  MapPin,
  Droplet,
  CalendarDays,
  Home,
  Globe,
  Landmark,
  ListChecks,
  Mars,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { registerPatient } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PatientSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode,
        country: formData.address.country,
      },
    };

    try {
      const res = await dispatch(registerPatient(payload));

      if (res.payload && res.payload.success) {
        toast.success("Patient registered successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        navigate("/login");
      } else {
        toast.error(res.payload?.message || "Patient registration failed!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        console.error("Registration failed:", res.payload);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Patient Sign Up
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-lg">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Full Name
          </label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <User className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="name"
              type="text"
              value={formData.name}
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <Mail className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="name@example.com"
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <KeyRound className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="At least 8 characters"
              minLength={8}
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mr-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone</label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <Phone className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              placeholder="123-456-7890"
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
            />
          </div>
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Age</label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <CalendarDays className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="age"
                type="number"
                value={formData.age}
                placeholder="25"
                min={0}
                max={120}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Gender
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <Mars className="w-5 h-5 text-gray-500 mx-2" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl cursor-pointer"
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blood Group*/}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Blood Group
          </label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <Droplet className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="bloodGroup"
              type="text"
              value={formData.bloodGroup}
              placeholder="O+, AB-"
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
            />
          </div>
        </div>

        {/* Address - Street */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Street</label>
          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
            <Home className="w-5 h-5 text-gray-500 mx-2" />
            <input
              name="street"
              type="text"
              value={formData.address.street}
              placeholder="123 Main Street"
              onChange={handleChange}
              className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
            />
          </div>
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <Landmark className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="city"
                type="text"
                value={formData.address.city}
                placeholder="Pune"
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              State
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <MapPin className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="state"
                type="text"
                value={formData.address.state}
                placeholder="Maharashtra"
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
        </div>

        {/* Pincode and Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Pincode
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <ListChecks className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="pincode"
                type="text"
                value={formData.address.pincode}
                placeholder="411001"
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Country
            </label>
            <div className="flex items-center rounded-xl border border-gray-300 bg-gray-200">
              <Globe className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="country"
                type="text"
                value={formData.address.country}
                placeholder="India"
                onChange={handleChange}
                className="w-full bg-gray-200 p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 
          transition focus:ring-4 focus:ring-blue-300 cursor-pointer"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default PatientSignUp;
