import { getLaneWidth } from "../utils";

// Color and style mappings
const colorMapping = {
  bg: {
    green: "#4ade80",
    yellow: "#fde047",
    red: "#ef4444",
  },
  text: {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-500",
  },
  glow: {
    green: "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]",
    yellow: "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
    red: "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  },
};

// Function to calculate crosswalk dimensions based on direction and lane count
const calculateDimensions = (direction, laneWidth, laneCount) => {
  if (direction === "vertical") {
    return {
      width: laneWidth * laneCount,
      height: laneWidth / 2,
    };
  } else {
    return {
      width: laneWidth / 2,
      height: laneWidth * laneCount,
    };
  }
};

const calculateCounterStyle = (direction, crosswalkPosition) => {
  // If the direction is vertical
  if (direction === "vertical") {
    return {
      left:
        crosswalkPosition === "left" ? `calc(100% + 10px)` : `calc(0% - 50px)`, // Position on left or right side
      top: "50%",
      transform: "translateY(-50%)",
    };
  } else {
    // If the direction is horizontal
    return {
      top:
        crosswalkPosition === "right" ? `calc(100% + 10px)` : `calc(0% - 50px)`, // Position on top or bottom side
      left: "50%",
      transform: "translateX(-50%)",
    };
  }
};

// Function to generate the crosswalk component
const renderCrosswalks = (
  roadConfig,
  direction,
  roadName,
  crosswalks,
  crosswalkSeconds
) => {
  if (!roadConfig.visible) return null;

  const sides = ["Left", "Right"];

  return sides.map((side) => {
    const isLeft = side === "Left";
    const laneKey = `lanes${side}`;
    const crosswalkKey = `cross_walk${side}`;
    const laneCount = roadConfig[laneKey].length;
    const laneWidth = getLaneWidth(); // Get lane width dynamically

    // Calculate crosswalk dimensions
    const { width: crosswalkWidth, height: crosswalkHeight } =
      calculateDimensions(direction, laneWidth, laneCount);

    // Determine the crosswalk signal and timer for the specific side
    const crosswalkSignal = crosswalks[side.toLowerCase()];
    const crosswalkTimer = crosswalkSeconds[side.toLowerCase()] || 0;

    // Positioning logic
    const { top, left } = calculatePosition(
      direction,
      isLeft,
      crosswalkWidth,
      crosswalkHeight,
      roadName
    );

    const counterStyle = calculateCounterStyle(direction, side.toLowerCase());
    return (
      <div
        key={side}
        className="absolute z-[999]"
        style={{
          width: `${crosswalkWidth}px`,
          height: `${crosswalkHeight}px`,
          top,
          left,
          backgroundImage: `repeating-linear-gradient(${
            direction === "vertical" ? "90deg" : "0"
          }, ${colorMapping.bg[crosswalkSignal]}, ${
            colorMapping.bg[crosswalkSignal]
          } 5px, transparent 5px, transparent 10px)`,
        }}
      >
        <div
          className={`absolute border border-white/10 rounded-full px-2 py-1 ${colorMapping.text[crosswalkSignal]} ${colorMapping.glow[crosswalkSignal]} font-digital text-xl`}
          style={counterStyle}
        >
          {crosswalkTimer}
        </div>
      </div>
    );
  });
};
export default renderCrosswalks;

const calculatePosition = (
  direction,
  isLeft,
  crosswalkWidth,
  crosswalkHeight,
  roadName
) => {
  if (direction === "vertical") {
    return {
      top: roadName === "north" ? `calc(100% - ${crosswalkHeight}px)` : `0`, // Far end of the road
      left: isLeft ? `calc(100% - ${crosswalkWidth}px)` : `0`, // Far end of the road
    };
  } else if (direction === "horizontal") {
    return {
      top: isLeft ? `0` : `calc(100% - ${crosswalkHeight}px)`, // Top or bottom of the road
      left: roadName === "west" ? `calc(100% - ${crosswalkWidth}px)` : `0`, // Left or right side of the road
    };
  }
};
