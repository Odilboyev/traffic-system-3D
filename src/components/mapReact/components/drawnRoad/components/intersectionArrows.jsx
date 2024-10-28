import {
  TbArrowDown,
  TbArrowLeft,
  TbArrowRight,
  TbArrowUp,
} from "react-icons/tb";
import { HiArrowsUpDown } from "react-icons/hi2";
import { useState, useEffect } from "react";

const IntersectionArrows = ({ trafficLights }) => {
  return (
    <div
      className="absolute flex items-center justify-center w-full h-full z-50"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={`flex font-bold text-5xl ${
          trafficLights.east === "green" ? "flex-col" : "flex-row"
        }`}
      >
        {trafficLights.east === "green" ? (
          <>
            <HiArrowsUpDown className="rotate-90" />
          </>
        ) : (
          <>
            <HiArrowsUpDown />
          </>
        )}
      </div>
    </div>
  );
};

export default IntersectionArrows;
