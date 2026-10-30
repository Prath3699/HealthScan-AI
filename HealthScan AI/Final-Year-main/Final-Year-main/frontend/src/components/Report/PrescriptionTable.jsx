const PrescriptionTable = ({ prescriptions }) => (
  <div className="mt-3">
    <h3 className="text-gray-500 font-medium mb-2">Prescription</h3>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Medicine</th>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-2">{item.medicine}</td>
              <td className="px-4 py-2">{item.time}</td>
              <td className="px-4 py-2">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PrescriptionTable;