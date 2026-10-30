import React, { useRef } from "react";
import InfoRow from "../components/Report/InfoRow";
import html2pdf from 'html2pdf.js'
import InfoBlock from "../components/Report/InfoBlock";
import PrescriptionTable from "../components/Report/PrescriptionTable";

const reportData = {
  patient: {
    name: "John Doe",
    age: 30,
    gender: "Male",
    dateOfCheckup: "03-09-2025",
  },
  medical: {
    disease: "Asthma",
    description:
      "Diagnosed with asthma at age 10. Symptoms include wheezing and shortness of breath, especially during exercise or exposure to allergens.",
    precautions: "Avoid oily food, smoking, and dust exposure.",
  },
  prescriptions: [
    { medicine: "Inhaler", time: "Twice Daily", amount: "2 Puffs" },
    { medicine: "Syrup", time: "Morning", amount: "5 ml" },
    { medicine: "Tablet", time: "Night", amount: "1 Pill" },
  ],
  doctorName: "Dr. Smith Johnson",
  nextSession: "10-09-2025",
  notes: "Patient should continue medication and follow breathing exercises.",
};

const ReportPage = () => {
  const reportRef = useRef();

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    const options = {
      margin: 0.3,
      filename: `Medical_Report_${reportData.patient.name}_${reportData.patient.dateOfCheckup}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <section className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🩺 Medical Report</h1>
        <button className="bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg py-2 px-5 shadow-md cursor-pointer" onClick={handleDownloadPdf}>
          Download PDF
        </button>
      </section>

      {/* Report Body */}
      <section ref={reportRef} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        {/* Patient Details */}
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700 mb-4">
          Patient Details
        </h2>
        <div>
          <InfoRow label="Name" value={reportData.patient.name} />
          <InfoRow label="Age" value={reportData.patient.age} />
          <InfoRow label="Gender" value={reportData.patient.gender} />
          <InfoRow
            label="Date of Checkup"
            value={reportData.patient.dateOfCheckup}
          />
        </div>

        {/* Medical Info */}
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700 my-6">
          Medical Info
        </h2>
        <div>
          <InfoRow label="Disease" value={reportData.medical.disease} />
          <InfoBlock
            label="Description"
            value={reportData.medical.description}
          />
          <PrescriptionTable prescriptions={reportData.prescriptions} />
          <InfoBlock
            label="Precautions"
            value={reportData.medical.precautions}
          />
        </div>

        {/* Doctor Section */}
        <div className="mt-4 ">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 text-gray-700">
            Doctor's Details
          </h3>
          <InfoRow label="Doctor's Name" value={reportData.doctorName} />
          <InfoRow label="Next Session Date" value={reportData.nextSession} />
          <InfoBlock label="Notes" value={reportData.notes} />
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
