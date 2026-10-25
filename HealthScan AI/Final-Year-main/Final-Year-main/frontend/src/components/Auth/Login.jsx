import React, { useEffect, useState } from "react";
import Doctor from "/IntroImage.png";
import { useDispatch } from "react-redux";
import { KeyRound, Mail, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Patient",
  });

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      toast.info(`You are already logged in as ${userData.role}.`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      navigate(userData.role === "Doctor" ? "/doctor" : "/patient");
    }
  }, [navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(loginUser(formData));
      if (res.payload && res.payload.success) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        navigate(formData.role === "Doctor" ? "/doctor" : "/patient");
      } else {
        toast.error(res.payload?.message || " Invalid credentials", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        console.error(
          "Login failed:",
          res.payload?.message || "Invalid credentials"
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-5xl">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold">HealthScan AI</h1>
          </div>
          <div className="mb-5">
            <h1 className="text-xl font-bold">Hi There...</h1>
            <p className="text-sm">Welcome Back </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex max-w flex-col gap-4 text-lg "
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium text-gray-700"
              >
                Your email
              </label>
              <div
                className="flex rounded-lg border border-gray-300 bg-gray-200
               focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <Mail className="w-8 h-8 my-auto text-gray-500 ml-2" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full  focus:outline-none p-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password1"
                className="mb-2 block  font-medium text-gray-700"
              >
                Your password
              </label>
              <div
                className="flex rounded-lg border border-gray-300 bg-gray-200
               focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <KeyRound className="w-8 h-8 my-auto text-gray-500 ml-2" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-2.5   focus:outline-none"
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

            <div>
              <label
                htmlFor="role"
                className="mb-2 block  font-medium text-gray-700"
              >
                Select your role
              </label>
              <div
                className="flex rounded-lg border border-gray-300 bg-gray-200
               focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <User className="w-8 h-8 my-auto text-gray-500 ml-2 " />
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full  p-2.5   focus:outline-none  cursor-pointer"
                  required
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-white
               hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center justify-center mt-4">
            <p>Don't have an account?</p>
            <Link to="/signup" className="ml-2 text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full max-md:hidden md:w-1/2">
          <img
            src={Doctor}
            alt="Doctor illustration"
            className="w-full h-full object-cover scale-105 "
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
