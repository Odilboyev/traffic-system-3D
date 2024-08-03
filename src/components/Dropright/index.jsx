import React, { useState } from "react";

const Dropright = ({ isOpen, content, setIsOpen }) => {
  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="no-scrollbar origin-top-right -top-24 absolute left-full ml-5 max-h-[80vh] overflow-y-scroll w-[50vw] rounded-md shadow-lg  ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {" "}
          <div className="flex justify-end absolute right-0 top-0 ">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800 /30 backdrop-blur-lg p-2 rounded-md"
            >
              ✕
            </button>
          </div>
          {content}
        </div>
      )}
    </div>
  );
};

export default Dropright;
