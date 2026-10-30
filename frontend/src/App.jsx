import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Appointment from "./Pages/Appointment";
import { ThemeInit } from "../.flowbite-react/init";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import LoginPage from "./Pages/LoginPage";
import NavbarComponent from "./components/Layout/Header";
import FooterComponent from "./components/Layout/Footer";
import SignupPage from "./Pages/SignupPage";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PatientDashboard from "./Pages/PatientDashboard";
import HomePage from "./Pages/HomePage";
import ReportPage from "./Pages/ReportPage";
import DiseaseManagement from "./Pages/DiseaseManagement";
import MedicalAI from "./Pages/MedicalAI";
import ReportFormPage from "./Pages/ReportFormPage";
import RoleProtectRoute from "./components/ProtectedRoute/RoleProtectRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MedicalHistorySummary from "./Pages/MedicalHistorySummary";
import SearchPage from "./Pages/SearchPage";
import View from "./Pages/View";

function App() {
  return (
    <Provider store={store}>
      <ThemeInit />
      <BrowserRouter>
        <div className="bg-gray-100">
          <NavbarComponent />
          <div className="px-4 pt-4 mt-15 md:px-6 md:py-9 ">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/doctor"
                element={
                  <RoleProtectRoute allowedRole="Doctor">
                    <DoctorDashboard />
                  </RoleProtectRoute>
                }
              />
              <Route
                path="/patient"
                element={
                  <RoleProtectRoute allowedRole="Patient">
                    <PatientDashboard />
                  </RoleProtectRoute>
                }
              />
              <Route path="/view/doctors/:doctorId" element={<View />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/disease" element={<DiseaseManagement />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/medical-ai" element={<MedicalAI />} />
              <Route path="/create-report" element={<ReportFormPage />} />
              <Route
                path="medical-summary/:patientId"
                element={<MedicalHistorySummary />}
              />
            </Routes>
          </div>
          <FooterComponent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
