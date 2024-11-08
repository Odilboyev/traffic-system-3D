import React, { useState } from "react";
import { FaRegMap, FaUser } from "react-icons/fa6";
import { IoIosArrowDown, IoMdSunny } from "react-icons/io";
import { MdBedtime } from "react-icons/md";
import { TbBell } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

// Sidebar Component
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed z-[9999999] top-0 left-0 h-full bg-gray-900 text-white shadow-lg flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out select-none`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-12 border-b border-gray-700 text-gray-400 hover:text-white"
      >
        {isOpen ? (
          <IoIosArrowBack size={24} />
        ) : (
          <IoIosArrowForward size={24} />
        )}
      </button>

      {/* Sidebar items */}
      <div className="flex flex-col items-center mt-4 space-y-6">
        <SidebarItem
          icon={<FaRegMap size={24} />}
          label="Map"
          isOpen={isOpen}
          extraContent={<MapComponent />} // Include your custom component here
        />
        <SidebarItem
          icon={<IoMdSunny size={24} />}
          label="Weather"
          isOpen={isOpen}
          extraContent={<WeatherComponent />} // Another custom component
        />
        <SidebarItem
          icon={<MdBedtime size={24} />}
          label="Night Mode"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<FaUser size={24} />}
          label="User Info"
          isOpen={isOpen}
          subItems={[
            { label: "Profile", icon: <FaUser size={16} /> },
            { label: "Settings", icon: <Cog6ToothIcon className="w-4 h-4" /> },
          ]}
        />
        <SidebarItem
          icon={<Cog6ToothIcon className="w-6 h-6" />}
          label="Settings"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<TbBell size={24} />}
          label="Notifications"
          isOpen={isOpen}
          subItems={[
            { label: "Alerts", icon: <TbBell size={16} /> },
            { label: "Sounds", icon: <TbBell size={16} /> },
          ]}
        />
      </div>
    </div>
  );
};

// SidebarItem Component with extra content
const SidebarItem = ({ icon, label, isOpen, subItems = [], extraContent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {/* Main item */}
      <div
        onClick={handleExpand}
        className={`flex items-center ${
          isOpen ? "justify-start" : "justify-center"
        } w-full px-4 py-3 items-center flex-nowrap hover:bg-gray-700 cursor-pointer transition-all duration-300 rounded-md`}
      >
        {icon}
        <span
          className={`ml-4 text-base font-medium transition-all duration-300 ${
            isOpen ? "visible block" : "invisible hidden"
          }`}
        >
          {label}
        </span>

        {subItems.length > 0 && isOpen && (
          <div className="ml-auto">
            {isExpanded ? (
              <IoIosArrowDown size={18} />
            ) : (
              <IoIosArrowBack size={18} />
            )}
          </div>
        )}
      </div>

      {/* Collapsible sub-items */}
      {isExpanded && isOpen && (
        <div className="flex flex-col pl-12 space-y-2 mt-2">
          <div className="mt-4">{extraContent}</div>
        </div>
      )}

      {/* Extra content inside collapsed item */}
      {/* {isOpen && extraContent && <div className="mt-4">{extraContent}</div>} */}
    </div>
  );
};

// Example Components to be added in the collapsed state
const MapComponent = () => (
  <div className="text-sm text-gray-400">Map Component Content</div>
);

const WeatherComponent = () => (
  <div className="text-sm text-gray-400">Weather Component Content</div>
);

export default Sidebar;
