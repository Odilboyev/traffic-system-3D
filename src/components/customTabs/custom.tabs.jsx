import React from "react";
import { Spinner } from "@material-tailwind/react";

const CustomTabs = ({ value, onChange, children, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex bg-gray-100 gap-1 dark:bg-gray-800 rounded-lg p-1">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            isActive: child.props.value === value,
            onClick: () => onChange(child.props.value),
          })
        )}
      </div>
    </div>
  );
};

const CustomTab = ({ value, children, isActive, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md transition-colors duration-200 
        ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export { CustomTabs, CustomTab };
