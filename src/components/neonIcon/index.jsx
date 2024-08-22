import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const statusStyles = {
  0: "dark:bg-green-500/20 bg-green-600/20 dark:text-green-300 text-green-400 ring-green-300 ",
  1: "dark:bg-yellow-500/20 bg-orange-600/20 dark:text-yellow-300 text-orange-600 dark:ring-yellow-300 ring-orange-600",
  2: "dark:bg-red-500/20 bg-red-600/20 dark:text-red-300 text-red-400 ring-red-300",
  3: "dark:bg-gray-500/20 bg-gray-600/20 dark:text-gray-300 text-gray-400 ring-gray-300",
};

const NeonIcon = ({ icon: Icon, iconStyle, text, status }) => {
  const statusClass = statusStyles[status] || statusStyles[0];
  return (
    <div
      className={`flex items-center justify-center p-2 rounded-full shadow-neon ring-1 ${statusClass} `}
    >
      {/* <Icon className="w-full" style={iconStyle} /> */}
      {Icon}
      {text && (
        <Typography className="mx-2 min-w-4 font-bold text-2xl">
          {text}
        </Typography>
      )}
    </div>
  );
};
NeonIcon.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.any,
  iconStyle: PropTypes.object,
  status: PropTypes.oneOf([0, 1, 2, 3, 4]).isRequired,
};

export default NeonIcon;
