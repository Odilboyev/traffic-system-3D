import { CameraIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { LiaTrafficLightSolid } from "react-icons/lia";
import { MdOutlineSensorWindow } from "react-icons/md";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const statusStyles = {
  0: "bg-green-500/20 text-green-300 ring-green-300 ",
  1: "bg-yellow-500/20 text-yellow-300 ring-yellow-300",
  2: "bg-red-500/20 text-red-300 ring-red-300",
  3: "bg-gray-500/20 text-gray-300 ring-gray-300",
};

const NeonIcon = ({ icon: Icon, iconStyle, text, status }) => {
  const statusClass = statusStyles[status] || statusStyles[0];
  console.log(Icon, text);
  return (
    <div
      className={`flex items-center justify-center p-2 rounded-full shadow-neon ring-1 ${statusClass} `}
    >
      <Icon className="w-8 h-8" style={iconStyle} />
      {text && (
        <Typography className="mx-3 min-w-4 font-bold text-2xl">
          {text}
        </Typography>
      )}
    </div>
  );
};
NeonIcon.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.any,
  status: PropTypes.oneOf([0, 1, 2, 3, 4]).isRequired,
};

export default NeonIcon;
