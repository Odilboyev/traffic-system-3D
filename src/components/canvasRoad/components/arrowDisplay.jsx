import React from "react";
import {
  TbArrowDown,
  TbArrowLeft,
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowRight,
  TbArrowUp,
} from "react-icons/tb";

const ArrowDisplay = ({
  laneIndex,
  lanesFrom,
  lanesTo,
  direction,
  totalLanes,
  laneWidth,
  roadName,
  trafficLights,
}) => {
  const isOutgoing = laneIndex >= lanesFrom;
  const isRightmost = laneIndex === totalLanes - 1; // Check if it's the rightmost lane
  const isLeftmost = laneIndex === 0; // Check if it's the leftmost lane

  let icon = null;

  const colorMappingText = {
    green: "text-green",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  // Add arrow icon logic based on lane direction and roadName

  if (roadName === "north") {
    if (!isOutgoing) {
      icon = isRightmost ? (
        <TbArrowRampLeft className="rotate-180 " />
      ) : isLeftmost ? (
        <TbArrowRampRight className="rotate-180 " />
      ) : (
        <TbArrowDown />
      );
    }
  } else if (roadName === "south") {
    if (isOutgoing) {
      icon = isRightmost ? (
        <TbArrowRampRight />
      ) : isLeftmost ? (
        <TbArrowRampLeft />
      ) : (
        <TbArrowUp />
      );
    }
  } else if (roadName === "east") {
    if (!isOutgoing) {
      icon = isRightmost ? (
        <TbArrowRampLeft className="-rotate-90" />
      ) : isLeftmost ? (
        <TbArrowRampRight className="-rotate-90" />
      ) : (
        <TbArrowLeft />
      );
    }
  } else if (roadName === "west") {
    if (isOutgoing) {
      icon = isRightmost ? (
        <TbArrowRampRight className="rotate-90" />
      ) : isLeftmost ? (
        <TbArrowRampLeft />
      ) : (
        <TbArrowRight />
      );
    }
  }

  return (
    <div
      className={`flex ${roadName === "north" ? "items-end " : "items-start"} ${
        roadName === "west" ? "justify-end" : "justify-start"
      } ${isOutgoing ? "bg-blue-gray-500" : "bg-blue-gray-700"}`}
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
          } font-bolder text-2xl bg-white rounded-xl p-1 `}
          style={{
            zIndex: 50,
            margin: direction === "vertical" ? "40px 5px" : "0px 40px",
          }}
        >
          {icon}
        </span>
      )}
    </div>
  );
};

export default ArrowDisplay;
