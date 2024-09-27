import React from "react";

import { iconOptions } from "../utils";

const ArrowDisplay = ({
  laneIndex,
  direction,
  laneWidth,
  left = false,
  roadName,
  icon,
  totalLanes,
  trafficLights,
}) => {
  // Rotation logic based on direction and roadName
  const getRotationAngle = () => {
    if (direction === "vertical") {
      if (roadName === "north") return "180deg"; // No rotation
      if (roadName === "south") return "0deg"; // Rotate 180 degrees
    } else if (direction === "horizontal") {
      if (roadName === "east") return "-90deg"; // Rotate 90 degrees
      if (roadName === "west") return "90deg"; // Rotate -90 degrees (or 270deg)
    }
    return "0deg"; // Default to no rotation
  };

  const isOutgoing = laneIndex >= totalLanes / 2;
  const isRightmost = laneIndex === totalLanes - 1;
  const isLeftmost = laneIndex === 0;

  const colorMappingText = {
    green: "text-green",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  return (
    <div
      className={`flex ${
        direction === "vertical"
          ? `justify-center  ${
              roadName === "south" ? "items-start" : "items-end"
            }`
          : `items-center ${
              roadName === "east" ? "justify-start" : "justify-end"
            }`
      } ${left ? "bg-blue-gray-500" : "bg-blue-gray-700"}`}
      style={{
        width: direction === "vertical" ? `${laneWidth}px` : "100%",
        height: direction === "horizontal" ? `${laneWidth}px` : "100%",
        textAlign: "center",
        lineHeight: `${laneWidth}px`,
        [direction === "vertical" ? "borderRight" : "borderBottom"]:
          laneIndex < totalLanes ? "1px dashed white" : "none",
      }}
    >
      {icon && (
        <span
          className={`${
            colorMappingText[trafficLights[roadName]]
          } font-bolder text-2xl bg-white rounded-xl p-1`}
          style={{
            zIndex: 50,
            margin: direction === "vertical" ? "40px 0px" : "0px 40px",
            transform: `rotate(${getRotationAngle()})`, // Apply rotation
          }}
        >
          {iconOptions.find((v) => v.value === icon)?.icon}
        </span>
      )}
    </div>
  );
};

export default ArrowDisplay;
