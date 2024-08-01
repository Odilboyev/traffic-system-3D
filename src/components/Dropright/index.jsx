import React, { useState } from "react";

const Dropright = ({ isOpen, content, setIsOpen }) => {
  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="origin-top-right absolute left-full ml-2 max-h-[70vh] overflow-y-scroll w-[70vw] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {" "}
          <div className="flex justify-end p-2">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
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
