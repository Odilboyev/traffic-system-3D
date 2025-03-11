import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const statusStyles = {
  0: "dark:bg-green-500/20 bg-green-600/20 dark:text-green-300 text-green-400 ring-green-300",
  1: "dark:bg-yellow-500/20 bg-orange-600/20 dark:text-yellow-300 text-orange-600 dark:ring-yellow-300 ring-orange-600",
  2: "dark:bg-red-500/20 bg-red-600/20 dark:text-red-300 text-red-400 ring-red-300",
  3: "dark:bg-gray-500/20 bg-gray-600/20 dark:text-gray-300 text-gray-400 ring-gray-300",
};

// Neon text color styles
const neonTextShadowStyles = {
  0: "text-green-400 dark:text-green-300",
  1: "text-orange-600 dark:text-yellow-300",
  2: "text-red-400 dark:text-red-300",
  3: "text-gray-400 dark:text-gray-300",
};

const NeonIcon = ({
  icon: Icon,
  iconStyle,
  isRounded,
  text,
  status,
  removeShadows,
  className,
}) => {
  const statusClass = statusStyles[status] || statusStyles[0];
  const textShadowClass =
    neonTextShadowStyles[status] || neonTextShadowStyles[0];

  // Determine the classes for the container
  let containerClasses = `flex items-center justify-center ${
    !removeShadows
      ? "shadow-sm text-green-300 rounded-full drop-shadow-neon"
      : ""
  }`;
  if (isRounded && Icon) {
    // If `isRounded` is true and `Icon` exists, add ring and background color
    containerClasses += ` rounded-full ring-1 ${statusClass}`;
  } else if (!isRounded && !Icon) {
    // If `isRounded` is false and `Icon` does not exist, add color, background color, and ring
    containerClasses += ` rounded-full ring-1 ${statusClass}`;
  } else if (Icon) {
    // If `Icon` exists and `isRounded` is false, apply text color without background or ring
    containerClasses += ` ${textShadowClass}`;
  }

  return (
    <div className={containerClasses}>
      {Icon ? (
        <div
          className={textShadowClass + " flex items-center" + className}
          style={iconStyle}
        >
          {Icon}{" "}
          {text && (
            <Typography className={`ml-2 font-bold text-xs ${textShadowClass}`}>
              {text}
            </Typography>
          )}
        </div>
      ) : (
        <Typography className={`mx-1 font-semibold text-xl ${textShadowClass}`}>
          {text}
        </Typography>
      )}
    </div>
  );
};

NeonIcon.propTypes = {
  icon: PropTypes.node, // Changed to node to accommodate div components
  text: PropTypes.any,
  iconStyle: PropTypes.object,
  status: PropTypes.oneOf([0, 1, 2, 3, 4]),
  isRounded: PropTypes.bool, // Ensure this prop is defined
};

export default NeonIcon;
