import { IconButton } from "@material-tailwind/react";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

const Dropright = ({ isOpen, content, setIsOpen }) => {
  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="no-scrollbar origin-top-left bottom-full absolute right-14 ml-5 max-h-[80vh] overflow-y-scroll w-[50vw] rounded-md shadow-lg  ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {" "}
          <IconButton
            onClick={() => setIsOpen(false)}
            className=" absolute right-0 top-0 z-50"
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
