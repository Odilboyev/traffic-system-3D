import PropTypes from "prop-types";
import { getCrosswalkWidth, getIntersectionSize, getRoadWidth } from "../utils";
import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";

const Intersection = ({
  id,
  config,
  trafficLights,
  crosswalks,
  seconds = {},
  crosswalkSeconds = {},
}) => {
  const getMaxRoadWidth = () => {
    return (
      Math.max(
        getRoadWidth(config.north),
        getRoadWidth(config.south),
        getRoadWidth(config.east),
        getRoadWidth(config.west)
      ) + 20
    );
  };

  const intersectionSize = getIntersectionSize(config);

  const renderLanes = (direction, roadName) =>
    config[roadName].visible && (
      <Lane
        angle={config.angle}
        lanesLeft={config[roadName].lanesLeft}
        lanesRight={config[roadName].lanesRight}
        direction={direction}
        roadName={roadName}
        trafficLights={trafficLights}
        seconds={seconds[roadName]} // Pass the seconds for this specific road
      />
    );

  const renderCrosswalks = (roadConfig, direction, roadName) => {
    const laneWidth = getCrosswalkWidth();
    const crosswalkWidth = getRoadWidth(roadConfig);
    const crosswalkHeight = laneWidth / 2;

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
          } font-digital text-xl`}
          style={counterStyle}
        >
          {crosswalkSeconds[roadName]}
        </div>
      </div>
    );
  };
  const roadWidthNorth = getRoadWidth(config.north);
  const roadWidthSouth = getRoadWidth(config.south);
  const roadWidthEast = getRoadWidth(config.east);
  const roadWidthWest = getRoadWidth(config.west);

  const centerX = intersectionSize / 2;
  const centerY = intersectionSize / 2;

  const calculateEdges = () => {
    return {
      north: {
        left: centerX - roadWidthNorth / 2,
        right: centerX + roadWidthNorth / 2,
      },
      south: {
        left: centerX - roadWidthSouth / 2,
        right: centerX + roadWidthSouth / 2,
      },
      east: {
        top: centerY - roadWidthEast / 2,
        bottom: centerY + roadWidthEast / 2,
      },
      west: {
        top: centerY - roadWidthWest / 2,
        bottom: centerY + roadWidthWest / 2,
      },
    };
  };

  // Update renderIntersectionBoundary without margins
  const renderIntersectionBoundary = () => {
    const edges = calculateEdges();

    // Directly calculate intersection boundary points based on edges
    const points = [
      { x: edges.north.left, y: 0 }, // North-left point
      { x: edges.north.right, y: 0 }, // North-right point
      { x: intersectionSize, y: edges.east.top }, // East-top point
      { x: intersectionSize, y: edges.east.bottom }, // East-bottom point
      { x: edges.south.right, y: intersectionSize }, // South-right point
      { x: edges.south.left, y: intersectionSize }, // South-left point
      { x: 0, y: edges.west.bottom }, // West-bottom point
      { x: 0, y: edges.west.top }, // West-top point
    ];

    const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <svg
        className="absolute"
        width={intersectionSize}
        height={intersectionSize}
      >
        {/* Fill the intersection area */}
        <polygon points={pointsString} className="fill-blue-gray-700" />
      </svg>
    );
  };

  // Function to calculate the margin based on any road having uneven lanes
  const calculateGlobalMargin = () => {
    const roads = [config.north, config.south, config.east, config.west];
    let totalMargin = 0;
    let samelengthCount = 0;
    // Loop through all roads
    for (const road of roads) {
      const lanesLeft = road.lanesLeft.length;
      const lanesRight = road.lanesRight.length;

      // If lanes are equal, return 0 immediately
      if (lanesLeft === lanesRight) {
        samelengthCount += 1;
      }
      if (samelengthCount >= 3) return 0;

      if (lanesLeft >= 3 && lanesRight >= 3) {
        // Check if lanes are uneven
        if (Math.abs(lanesLeft - lanesRight) >= 2) {
          // Set the margin based on the difference
          totalMargin = -(Math.abs(lanesLeft - lanesRight) * 10 + 40);
        } else {
          totalMargin = -40;
        }
      }
    }

    return totalMargin;
  };

  // Calculate margin once
  const margin = calculateGlobalMargin();
  return (
    <div
      className={`relative ${
        id ? "w-full" : "w-2/3"
      } h-full flex items-center justify-center overflow-hidden`}
      style={{ transform: `rotate(${config.angle}deg)` }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          width: `${intersectionSize}px`,
          height: `${intersectionSize}px`,
          top: `calc(50% - ${intersectionSize / 2}px)`,
          left: `calc(50% - ${intersectionSize / 2}px)`,
        }}
      >
        <IntersectionArrows
          trafficLights={trafficLights}
          currentDirection={
            trafficLights.east === "green" ? "east-west" : "north-south"
          }
        />
        {renderIntersectionBoundary()}
      </div>

      {/* Rendering North and South Roads */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.north)}px`,
          height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          top: margin,
          left: `calc(50% - ${getRoadWidth(config.north) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "north")}
        {renderCrosswalks(config.north, "vertical", "north")}
      </div>
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.south)}px`,
          height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          bottom: margin,
          left: `calc(50% - ${getRoadWidth(config.south) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "south")}
        {renderCrosswalks(config.south, "vertical", "south")}
      </div>

      {/* Rendering East and West Roads */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          height: `${getRoadWidth(config.west)}px`,
          width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          left: margin,
          top: `calc(50% - ${getRoadWidth(config.west) / 2}px)`,
        }}
      >
        {renderLanes("horizontal", "west")}
        {renderCrosswalks(config.west, "horizontal", "west")}
      </div>
      <div
        className="absolute flex flex-col items-center"
        style={{
          height: `${getRoadWidth(config.east)}px`,
          width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          right: margin,
          top: `calc(50% - ${getRoadWidth(config.east) / 2}px)`,
        }}
      >
        {renderLanes("horizontal", "east")}
        {renderCrosswalks(config.east, "horizontal", "east")}
      </div>
    </div>
  );
};

Intersection.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  config: PropTypes.shape({
    angle: PropTypes.number,
    north: PropTypes.object,
    south: PropTypes.object,
    east: PropTypes.object,
    west: PropTypes.object,
  }).isRequired,
  trafficLights: PropTypes.object.isRequired,
  crosswalks: PropTypes.object.isRequired,
};

export default Intersection;
