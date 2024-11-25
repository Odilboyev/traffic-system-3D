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
  seconds,
  channelId,
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
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  const colorMappingGlow = {
    green: "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]",
    yellow: "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
    red: "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  };

  // Add size classes based on isInModal
  const iconSizeClass = "text-2xl";
  const numberSizeClass = "text-xl";

  // Adjust margins for modal
  const marginSize = "40px";

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
        <div
          className="flex flex-col items-center gap-1"
          style={{
            zIndex: 50,
            margin:
              direction === "vertical"
                ? `${marginSize} 0px`
                : `0px ${marginSize}`,
            transform: `rotate(${getRotationAngle()})`,
          }}
        >
          <span
            className={`${colorMappingText[trafficLights[roadName]]} ${
              colorMappingGlow[trafficLights[roadName]]
            } font-bolder ${iconSizeClass}`}
          >
            {iconOptions.find((v) => v.value === icon)?.icon}
          </span>
          {channelId && typeof seconds === "number" && (
            <span
              className={`${colorMappingText[trafficLights[roadName]]} ${
                colorMappingGlow[trafficLights[roadName]]
              } font-digital ${numberSizeClass} leading-none`}
              style={{
                transform: `rotate(${
                  roadName === "east" ? "90deg" : "-" + getRotationAngle()
                })`,
              }}
            >
              {seconds}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ArrowDisplay;
