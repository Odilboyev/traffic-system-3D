import { IconButton } from "@material-tailwind/react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../../customHooks/useTheme";

const Dropright = ({
  isOpen,
  content,
  setIsOpen,
  wrapperClass = "fixed top-5 inline-block text-left",
  sndWrapperClass = "top-0 left-0 no-scrollbar absolute ml-5 max-h-[80vh] overflow-y-scroll w-[50vw] rounded-md shadow-lg  ring-1 ring-black ring-opacity-5",
}) => {
  const { theme } = useTheme();
  return (
    <div className={wrapperClass}>
      {isOpen && (
        <div
          className={sndWrapperClass}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {" "}
          <IconButton
            size="sm"
            color={theme === "dark" ? "black" : "white"}
            onClick={() => setIsOpen(false)}
            className=" absolute right-0 top-0 z-50 "
          >
            <IoMdClose className="w-5 h-5 p-1" />
          </IconButton>
          {content}
        </div>
      )}
    </div>
  );
};

export default Dropright;
