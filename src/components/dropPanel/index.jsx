import { IconButton, Typography } from "@material-tailwind/react";

import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { t } from "i18next";

const DropPanel = ({
  icon: Icon,
  label,
  children,
  isDropOpen,
  hanleDropDownOpen,
  menuPlacement = "top", // default to "bottom"
  wrapperClass = "relative inline-block text-left",
  sndWrapperClass = "no-scrollbar max-h-[80vh] overflow-y-scroll w-[50vw]",
}) => {
  // Determine position classes based on menuPlacement
  const positionClass =
    menuPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div className={wrapperClass}>
      <IconButton onClick={() => hanleDropDownOpen(!isDropOpen)}>
        <Icon className="w-6 h-6" />
      </IconButton>

      {isDropOpen && (
        <div
          className={`${sndWrapperClass} ${positionClass} absolute left-0 rounded-md  bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {/* Header with Title and Close Button */}
          {label && (
            <div className="rounded-lg rounded-b-none flex justify-between items-center gap-2 p-1 border-b border-gray-700">
              <Typography className="text-sm ml-2 text-white font-medium">
                {t(label)}
              </Typography>

              <IconButton
                size="sm"
                variant="text"
                onClick={() => hanleDropDownOpen(false)}
              >
                <IoMdClose className="w-5 h-5 p-1" />
              </IconButton>
            </div>
          )}

          {/* Content */}
          <div className="bg-gray-900/30 backdrop-blur-md rounded-b-lg p-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

DropPanel.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  content: PropTypes.node,
  menuPlacement: PropTypes.oneOf(["top", "bottom"]),
  wrapperClass: PropTypes.string,
  sndWrapperClass: PropTypes.string,
};

export default DropPanel;
