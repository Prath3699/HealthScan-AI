const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b last:border-none">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default InfoRow;