import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const MedicalHistorySummary = () => {
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const { patientId } = useParams(); 

  const [patient, setPatient] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Fetch patient and disease list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, diseaseRes] = await Promise.all([
          axios.get(`${API_URL}/api/patient/summary/${patientId}`),
          axios.get(`${API_URL}/api/disease/`),
        ]);

        if (patientRes.data.success) setPatient(patientRes.data.patient);
        if (diseaseRes.data.success) setDiseases(diseaseRes.data.diseases);
      } catch (error) {
        toast.error("Error fetching data. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        console.error("Error fetching data:", error);
      }
    };

    if (patientId) fetchData();
  }, [patientId]);

  // patient input change
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };
  //  SAVE PATIENT DETAILS
  const handleSavePatient = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/patient/update/${patientId}`,
        {
          name: patient.name,
          age: patient.age,
          phone: patient.phone,
        }
      );

      if (res.data.success) {
        setPatient(res.data.patient);
        setIsEditingPatient(false);
        toast.success("Patient details updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error("Failed to update patient details.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Error updating patient details.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Error updating patient details:", error);
    }
  };
  // fetch disease selected details
  const handleDiseaseSelect = async (e) => {
    const diseaseId = e.target.value;
    setSelectedDiseaseId(diseaseId);

    if (!diseaseId) {
      setSelectedDisease(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/disease/${diseaseId}`);
      if (res.data.success) {
        setSelectedDisease(res.data.disease);
      }
    } catch (error) {
      toast.error("Error fetching disease details.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Error fetching disease details:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDiseaseId) {
      toast.warning("Please select a disease before submitting.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/patient/update/${patientId}`,
        {
          medicalHistory: {
            diseaseId: selectedDiseaseId,
            diagnosedOn: new Date(),
            notes: selectedDisease?.notes || "",
          },
        }
      );

      if (res.data.success) {
        toast.success("Medical history updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error("Failed to update medical history.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Error submitting medical history.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Error submitting medical history:", error);
    }
  };

  if (!patient)
    return <p className="text-center text-gray-600">Loading patient data...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-2">Medical History Summary</h2>
      <p className="text-gray-600 mb-6">
        Review and confirm your medical history information before submission.
      </p>

      {/* PATIENT DEMOGRAPHICS  */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Patient Demographics</h3>
          {isEditingPatient ? (
            <div className="space-x-2 cursor-pointer">
              <button
                className="text-green-600 text-sm font-medium cursor-pointer"
                onClick={handleSavePatient}
              >
                Save
              </button>
              <button
                className="text-gray-500 text-sm cursor-pointer"
                onClick={() => setIsEditingPatient(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-blue-600 text-sm hover:underline cursor-pointer"
              onClick={() => setIsEditingPatient(true)}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Name */}
          <div className="flex justify-between items-center">
            <p className="font-semibold w-1/2">Name</p>
            {isEditingPatient ? (
              <input
                type="text"
                name="name"
                value={patient.name || ""}
                onChange={handlePatientChange}
                className="border rounded-md p-2 w-1/2 text-gray-700"
              />
            ) : (
              <p className="text-gray-800 text-right w-1/2">{patient.name}</p>
            )}
          </div>

          {/* Age */}
          <div className="flex justify-between items-center">
            <p className="font-semibold w-1/2">Age</p>
            {isEditingPatient ? (
              <input
                type="number"
                name="age"
                value={patient.age || ""}
                onChange={handlePatientChange}
                className="border rounded-md p-2 w-1/2 text-gray-700"
              />
            ) : (
              <p className="text-gray-800 text-right w-1/2">{patient.age}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex justify-between items-center">
            <p className="font-semibold w-1/2">Contact Info</p>
            {isEditingPatient ? (
              <input
                type="text"
                name="phone"
                value={patient.phone || ""}
                onChange={handlePatientChange}
                className="border rounded-md p-2 w-1/2 text-gray-700"
              />
            ) : (
              <p className="text-gray-800 text-right w-1/2">{patient.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Medical Information</h3>

        {/* Disease Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Disease
          </label>
          <select
            value={selectedDiseaseId}
            onChange={handleDiseaseSelect}
            className="border rounded-md p-2 w-full text-gray-700 cursor-pointer"
          >
            <option value="">-- Select Disease --</option>
            {diseases.map((disease) => (
              <option key={disease._id} value={disease._id}>
                {disease.name}
              </option>
            ))}
          </select>
        </div>

        {/* Disease Details */}
        {selectedDisease && (
          <div className="space-y-4">
            {/* Name */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Disease Name</p>
              <p className="text-gray-700">{selectedDisease.name}</p>
            </div>

            {/* Description */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Description</p>
              <p className="text-gray-700">{selectedDisease.description}</p>
            </div>

            {/* Symptoms */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {selectedDisease.symptoms?.length > 0 ? (
                  selectedDisease.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-700">No symptoms listed.</p>
                )}
              </div>
            </div>

            {/* Precautions */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Precautions</p>
              <p className="text-gray-700">{selectedDisease.precautions}</p>
            </div>

            {/* Medication */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Medication</p>
              <p className="text-gray-700">{selectedDisease.medication}</p>
            </div>

            {/* Workflow */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Workflow</p>
              <p className="text-gray-700">{selectedDisease.workflow}</p>
            </div>

            {/* Notes */}
            <div>
              <p className="font-semibold text-gray-800 mb-1">Notes</p>
              <p className="text-gray-700">{selectedDisease.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 
          rounded-md cursor-pointer"
        >
          Confirm and Submit
        </button>
      </div>
    </div>
  );
};

export default MedicalHistorySummary;
