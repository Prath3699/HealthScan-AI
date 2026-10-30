import { useState } from "react";
import InfoRow from "./InfoRow";
import EditablePrescriptionTable from "./EditablePrescriptionTable";

const ReportForm = () => {
  const [prescriptions, setPrescriptions] = useState([
    { medicine: "", time: "", amount: "" },
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          🩺 Medical Report Form
        </h1>
      </section>

      {/* Patient Info */}
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
        Patient Details
      </h2>

      <div className="space-y-1">
        <InfoRow label="Name" value="John Doe" />
        <InfoRow label="Age" value={30} />
        <InfoRow label="Gender" value="Male" />
        <InfoRow
          label="Date of Checkup"
          value={new Date().toLocaleDateString()}
        />
      </div>

      <hr className="my-6" />

      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
        Medical Details
      </h2>

      {/* Form Fields */}
      <form className="flex flex-col gap-5 text-sm text-gray-800">
        {/* Diseases */}
        <div>
          <label className="text-sm font-medium text-gray-600">Diseases</label>
          <input
            type="text"
            placeholder="Asthma, Diabetes, etc."
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg  focus:outline-blue-500 focus:outline-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            placeholder="Enter your diagnosis here..."
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg  focus:outline-blue-500 focus:outline-2"
          />
        </div>

        {/* Prescription Table */}
        <EditablePrescriptionTable
          prescriptions={prescriptions}
          setPrescriptions={setPrescriptions}
        />

        {/* Precautions */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Precautions
          </label>
          <input
            type="text"
            placeholder="e.g., Avoid oily food"
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg  focus:outline-blue-500 focus:outline-2"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-gray-600">Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="e.g., Patient should continue medication and follow breathing exercises."
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg  focus:outline-blue-500 focus:outline-2"
          />
        </div>

        {/* Next Visit */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Next Visit
          </label>
          <input
            type="date"
            name="nextVisit"
            className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg  focus:outline-blue-500 focus:outline-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
