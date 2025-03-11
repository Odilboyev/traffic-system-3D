import { IconButton, Typography } from "@material-tailwind/react";

import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

const SidePanel = ({
  title,
  isOpen,
  content,
  setIsOpen,
  wrapperClass = "absolute inline-block text-left",
  sndWrapperClass = "absolute left-full no-scrollbar max-h-[80vh] overflow-y-scroll w-[50vw] ",
}) => {
  return (
    <div className={wrapperClass}>
      {isOpen && (
        <div
          className={`${sndWrapperClass} ml-3 rounded-md backdrop-blur-md bg-gray-900/60 shadow-lg ring-1 ring-black ring-opacity-5`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div
            className={`rounded-lg rounded-b-none flex justify-between items-center gap-2 p-1 border-b border-gray-700 `}
          >
            <Typography className="text-sm ml-2 text-white font-medium">
              {title}
            </Typography>
            <IconButton
              size="sm"
              variant="text"
              // color={theme === "dark" ? "black" : "white"}
              onClick={() => setIsOpen(false)}
              className=""
            >
              <IoMdClose className="w-5 h-5 p-1" />
            </IconButton>
          </div>{" "}
          <div className="bg-gray-900/30 backdrop-blur-md rounded-b-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

SidePanel.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  content: PropTypes.node,
  setIsOpen: PropTypes.func,
  wrapperClass: PropTypes.string,
  sndWrapperClass: PropTypes.string,
  padding: PropTypes.string,
};

export default SidePanel;
