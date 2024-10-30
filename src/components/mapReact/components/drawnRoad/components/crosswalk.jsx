import { getLaneWidth, getRoadWidth } from "../utils";

const renderCrosswalks = (
  roadConfig,
  direction,
  roadName,
  crosswalks,
  crosswalkSeconds,
  isInModal
) => {
  const crosswalkWidth = getRoadWidth(roadConfig, isInModal);
  const crosswalkHeight = getLaneWidth(isInModal) / 2;

  if (!roadConfig.visible) return null;

  let top, left;
  if (direction === "vertical") {
    top = roadName === "north" ? `calc(100% - ${crosswalkHeight}px)` : `0`;
    left = `calc(50% - ${crosswalkWidth / 2}px)`;
  } else {
    top = `calc(50% - ${crosswalkWidth / 2}px)`;
    left = roadName === "east" ? `0` : `calc(100% - ${crosswalkHeight}px)`;
  }

  const colorMappingBG = {
    green: "#4ade80",
    yellow: "#fde047",
    red: "#ef4444",
  };

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

  // Calculate counter position based on direction and road name
  let counterStyle = {};
  if (direction === "vertical") {
    counterStyle = {
      left: `calc(100% + 10px)`,
      top: "50%",
      transform: "translateY(-50%)",
    };
  } else {
    counterStyle = {
      top: `calc(100% + 10px)`,
      left: "50%",
      transform: "translateX(-50%)",
    };
  }

  return (
    <div
      className={`absolute`}
      style={{
        width:
          direction === "vertical"
            ? `${crosswalkWidth}px`
            : `${crosswalkHeight}px`,
        height:
          direction === "vertical"
            ? `${crosswalkHeight}px`
            : `${crosswalkWidth}px`,
        top,
        left,
        backgroundImage: `repeating-linear-gradient(${
          direction === "vertical" ? "90deg" : "0"
        }, ${colorMappingBG[crosswalks[roadName]]}, ${
          colorMappingBG[crosswalks[roadName]]
        } 5px, transparent 5px, transparent 10px)`,
        zIndex: 50,
      }}
    >
      <div
        className={`absolute ${colorMappingText[crosswalks[roadName]]} ${
          colorMappingGlow[crosswalks[roadName]]
        } font-digital ${isInModal ? "text-base" : "text-xl"}`}
        style={counterStyle}
      >
        {crosswalkSeconds[roadName]}
      </div>
    </div>
  );
};

export default renderCrosswalks;
