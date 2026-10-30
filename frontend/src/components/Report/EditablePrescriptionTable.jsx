import { useState } from "react";
import { Trash2, PlusIcon } from "lucide-react";

const EditablePrescriptionTable = ({ prescriptions, setPrescriptions }) => {
  const [errorIndex, setErrorIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleDeleteRow = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    const lastItem = prescriptions.at(-1);
    if (
      lastItem &&
      (lastItem.medicine === "" ||
        lastItem.time === "" ||
        lastItem.amount === "")
    ) {
      setErrorIndex(prescriptions.length - 1);
      return;
    }

    setErrorIndex;
    setPrescriptions([
      ...prescriptions,
      { medicine: "", time: "", amount: "" },
    ]);
  };

  return (
    <div className="mt-5">
      <h3 className="text-gray-600 font-semibold mb-2">Prescription</h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Medicine</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {prescriptions.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">
                  <input
                    value={item.medicine}
                    name="medicine"
                    onChange={(e) =>
                      handleChange(index, "medicine", e.target.value)
                    }
                    className={`w-full bg-transparent px-2 py-1 outline-none rounded ${
                      errorIndex === index && !item.medicine
                        ? "border border-red-500 ring-1 ring-red-300"
                        : "border border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="e.g. Amoxicillin"
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    value={item.time}
                    name="time"
                    onChange={(e) =>
                      handleChange(index, "time", e.target.value)
                    }
                    className={`w-full bg-transparent px-2 py-1 outline-none rounded ${
                      errorIndex === index && !item.time
                        ? "border border-red-500 ring-1 ring-red-300"
                        : "border border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="Morning / Night"
                  />
                </td>

                <td className="px-4 py-2">
                  <input
                    value={item.amount}
                    name="amount"
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
                    }
                    className={`w-full bg-transparent px-2 py-1 outline-none rounded ${
                      errorIndex === index && !item.amount
                        ? "border border-red-500 ring-1 ring-red-300"
                        : "border border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="1 Tablet"
                  />
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleAddRow}
        className="mt-3 mx-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        <PlusIcon className="h-5 w-5" />
        Add Medicine
      </button>
    </div>
  );
};

export default EditablePrescriptionTable;
