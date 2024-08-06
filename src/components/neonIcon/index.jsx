// NeonIcon.jsx
import React from "react";
import PropTypes from "prop-types";

const statusStyles = {
  0: "bg-green-500/20 text-green-300 ring-green-300 ",
  1: "bg-yellow-500/20 text-yellow-300 ring-yellow-300",
  2: "bg-red-500/20 text-red-300 ring-red-300",
  3: "bg-gray-500/20 text-gray-300 ring-gray-300",
};

const NeonIcon = ({ icon: Icon, status }) => {
  const statusClass = statusStyles[status] || statusStyles[0]; // Default to 'inactive' if status is unknown

  return (
    <div
      className={`flex items-center justify-center p-2 rounded-full shadow-neon ring-1 ${statusClass} `}
    >
      <Icon className="w-8 h-8" />
    </div>
  );
};

NeonIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  status: PropTypes.oneOf([1, 2, 3, 4]).isRequired,
};

export default NeonIcon;
