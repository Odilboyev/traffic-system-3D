import {
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowRotaryStraight,
  TbCornerUpLeft,
  TbCornerUpRight,
} from "react-icons/tb";

import { MdStraight } from "react-icons/md";
import { PiArrowULeftDownBold } from "react-icons/pi";
import React from "react";

const ModernTrafficLight = ({ type, status, countdown, rotate }) => {
  const getIconComponent = () => {
    switch (type) {
      case 1:
        return TbArrowRotaryStraight;
      case 3:
        return TbCornerUpRight;
      case 4:
        return TbCornerUpLeft;
      case 5:
        return TbArrowRampRight;
      case 6:
        return TbArrowRampLeft;
      case 8:
        return PiArrowULeftDownBold;
      default:
        return MdStraight;
    }
  };

  const IconComponent = getIconComponent();
  const bgColor =
    status === 1 ? "#22c55e" : status === 2 ? "#ef4444" : "#eab308";
  const textColor = "white";

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full h-full rounded-xl border-4 border-gray-900 overflow-hidden flex flex-col items-center justify-center"
        style={{
          backgroundColor: bgColor,
          transform: `rotate(${rotate}deg)`,
          minWidth: "35px",
          minHeight: "65px",
        }}
      >
        {/* {status === 2 && (
        <div className="">
          <span className="text-white text-xl">×</span>
        </div>
      )} */}
        <div className="text-xl font-bold" style={{ color: textColor }}>
          {countdown || "0"}
        </div>
        <div className="mt-1">
          <IconComponent className="text-white w-6 h-6" />
        </div>
      </div>
      <div
        className="w-2 h-8 bg-gray-900 border-l border-l-gray-600 border-r border-r-gray-600 border-b border-b-gray-900 rounded-b-md"
        style={{
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </div>
  );
};

export default ModernTrafficLight;
