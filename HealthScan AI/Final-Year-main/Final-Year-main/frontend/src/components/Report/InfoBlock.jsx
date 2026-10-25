const InfoBlock = ({ label, value }) => (
  <div className="py-3 border-b last:border-none">
    <span className="text-gray-500 font-medium block mb-1">{label}</span>
    <p className="text-gray-900 leading-relaxed">{value}</p>
  </div>
);
export default InfoBlock;