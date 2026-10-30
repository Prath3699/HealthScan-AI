import {
  Activity,
  ArrowBigRight,
  CircleAlert,
  ClipboardList,
  Clock,
  Loader2,
  MapPin,
  Pill,
  Printer,
  Salad,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import api from "../api/client";

const TABS = [
  { key: "description", label: "Description", icon: Stethoscope },
  { key: "medication", label: "Medications", icon: Pill },
  { key: "precautions", label: "Precaution", icon: CircleAlert },
  { key: "dietNotes", label: "Diets", icon: Salad },
];

// Render the tab icon through a capitalized local alias. (Destructuring an
// uppercase property like `Icon` directly in an arrow-function parameter is
// miscounted by ESLint v9's core no-unused-vars — see eslint#19958.)
function TabButton({ tab, active, onSelect }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(tab.key)}
      className={`flex justify-center items-center font-semibold rounded-xl w-full p-2.5 text-white ${
        active ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
      }`}
    >
      <Icon className="w-5 h-5 text-white mx-2" />
      {tab.label}
    </button>
  );
}

const MedicalAI = () => {
  const [form, setForm] = useState({
    patientName: "",
    patientAge: "",
    diseaseDuration: "",
    patientLocation: "",
    patientSymptoms: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { predictions, input, disclaimer }
  const [activeTab, setActiveTab] = useState("description");

  const track = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!form.patientSymptoms.trim()) {
      toast.error("Please enter at least one symptom.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/api/predict", {
        ...form,
        patientAge: Number(form.patientAge),
        diseaseDuration: Number(form.diseaseDuration),
      });
      if (!data.predictions || data.predictions.length === 0) {
        toast.info("No matching disease found in the catalog.");
      }
      setResult({ predictions: data.predictions || [], input: data.input, disclaimer: data.disclaimer });
      setActiveTab("description");
    } catch (err) {
      toast.error(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const top = result?.predictions?.[0];

  const handlePrint = () => {
    const el = document.getElementById("ai-report-card");
    if (!el) return;
    html2pdf()
      .set({
        margin: 10,
        filename: `healthscan-ai-${top?.name?.replace(/\s+/g, "-") || "report"}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      })
      .from(el)
      .save();
  };

  return (
    <div className="mt-3 px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <div className="text-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Smart HealthCare &amp; Customised Medical Treatment Recommendation
        </h1>
        <p className="flex items-center justify-center gap-1 mt-1">
          <Sparkles className="w-4 h-4 text-green-500" />
          Powered by Health Scan - AI Model
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ---------- Input form ---------- */}
        <form
          onSubmit={handlePredict}
          className="flex flex-col gap-2 mt-3 border-2 px-3 py-2 md:px-5 md:py-3 rounded-lg border-gray-200"
        >
          <div>
            <label className="block mb-1 font-normal text-gray-700">Full Name :</label>
            <div className="flex items-center rounded-xl border border-gray-300">
              <User className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={form.patientName}
                onChange={track("patientName")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2">
            <div>
              <label className="block mb-1 font-normal text-gray-700">Age :</label>
              <div className="flex items-center rounded-xl border border-gray-300">
                <Activity className="w-5 h-5 text-gray-500 mx-2" />
                <input
                  name="age"
                  type="number"
                  min="0"
                  max="130"
                  placeholder="Enter your age"
                  required
                  value={form.patientAge}
                  onChange={track("patientAge")}
                  className="w-full p-2.5 focus:outline-none rounded-r-xl"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-normal text-gray-700">Duration (days) :</label>
              <div className="flex items-center rounded-xl border border-gray-300">
                <Clock className="w-5 h-5 text-gray-500 mx-2" />
                <input
                  name="duration"
                  type="number"
                  min="0"
                  placeholder="Enter disease duration"
                  required
                  value={form.diseaseDuration}
                  onChange={track("diseaseDuration")}
                  className="w-full p-2.5 focus:outline-none rounded-r-xl"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-normal text-gray-700">Enter your location :</label>
            <div className="flex items-center rounded-xl border border-gray-300">
              <MapPin className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="location"
                type="text"
                placeholder="Enter your location"
                required
                value={form.patientLocation}
                onChange={track("patientLocation")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-normal text-gray-700">
              Enter Symptoms <span className="text-gray-400">(comma separated)</span> :
            </label>
            <div className="flex items-center rounded-xl border border-gray-300">
              <ClipboardList className="w-5 h-5 text-gray-500 mx-2" />
              <input
                name="symptoms"
                type="text"
                placeholder="e.g. fever, headache, body pains"
                required
                value={form.patientSymptoms}
                onChange={track("patientSymptoms")}
                className="w-full p-2.5 focus:outline-none rounded-r-xl"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-400 hover:bg-green-500 disabled:opacity-60 flex my-3 justify-center items-center text-white font-semibold rounded-xl w-full p-2.5"
          >
            {loading ? (
              <>
                Analyzing <Loader2 className="w-5 h-5 animate-spin text-white mx-2" />
              </>
            ) : (
              <>
                Predict <ArrowBigRight className="w-5 h-5 text-white mx-2" />
              </>
            )}
          </button>
        </form>

        {/* ---------- Results ---------- */}
        {result && (
          <div id="ai-report-card" className="flex flex-col gap-2 px-4 py-3">
            {result.predictions.length === 0 ? (
              <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 rounded-lg p-4 text-sm">
                No diseases in the catalog matched these symptoms. Please consult a doctor.
              </div>
            ) : (
              <>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{top.name}</span>
                    <span className="text-sm text-green-700 font-medium">
                      {top.confidence}% match
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100">
                    <div
                      className="h-2 bg-green-400 transition-all"
                      style={{ width: `${Math.min(top.confidence, 100)}%` }}
                    />
                  </div>
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Matched symptoms: {top.matchedSymptoms.join(", ") || "—"} · Spread risk:{" "}
                    {top.spreadLevel}
                    {top.nearbyAffectedRegions?.length > 0 && (
                      <div className="mt-1">
                        Near you:{" "}
                        {top.nearbyAffectedRegions
                          .map((r) => `${r.city} (${r.caseCount ?? "?"} cases)`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="px-4 pb-3 min-h-[90px] text-sm text-gray-700 whitespace-pre-line">
                    {top[activeTab] || "No information recorded for this section."}
                  </div>
                </div>

                {/* Other candidates */}
                {result.predictions.length > 1 && (
                  <div className="text-xs text-gray-500">
                    Other possibilities:{" "}
                    {result.predictions
                      .slice(1)
                      .map((p) => `${p.name} (${p.confidence}%)`)
                      .join(", ")}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {TABS.map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      active={activeTab === tab.key}
                      onSelect={setActiveTab}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-green-400 hover:bg-green-500 flex justify-center items-center text-white font-semibold rounded-xl w-full p-2.5"
                >
                  Print Report <Printer className="w-5 h-5 text-white mx-2" />
                </button>
              </>
            )}
            {result.disclaimer && (
              <p className="text-[11px] text-gray-400 italic">{result.disclaimer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAI;
