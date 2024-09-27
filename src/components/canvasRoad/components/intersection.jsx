import { getIntersectionSize, getLaneWidth, getRoadWidth } from "../utils";
import Crosswalk from "./crosswalk";
import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";

const Intersection = ({ config, trafficLights, crosswalks }) => {
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

  const intersectionSize = getIntersectionSize(config) * 2;

  const renderLanes = (direction, roadName) =>
    config[roadName].visible && (
      <Lane
        lanesLeft={config[roadName].lanesLeft}
        lanesRight={config[roadName].lanesRight}
        direction={direction}
        roadName={roadName}
        trafficLights={trafficLights}
      />
    );

  const renderCrosswalks = (roadConfig, direction, roadName) => {
    const laneWidth = 10;
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
      red: "#fde047",
      red: "#ef4444",
    };

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
      />
    );
  };
  const calculateEdges = () => {
    const roadWidthNorth = getRoadWidth(config.north);
    const roadWidthSouth = getRoadWidth(config.south);
    const roadWidthEast = getRoadWidth(config.east);
    const roadWidthWest = getRoadWidth(config.west);

    const centerX = intersectionSize / 2;
    const centerY = intersectionSize / 2;
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

  const renderIntersectionBoundary = () => {
    const edges = calculateEdges();

    // Coordinates for the corners of the roads where they meet
    const roadEdgeDistance = 90; // Distance from the center to start diagonal lines
    // Calculate the intersection area boundaries
    const margin = 45; // Adjust this value based on how much smaller you want it

    const points = [
      { x: edges.north.left + margin, y: margin }, // North-left point
      { x: edges.north.right - margin, y: margin }, // North-right point
      { x: intersectionSize - margin, y: edges.east.top + margin }, // East-top point
      { x: intersectionSize - margin, y: edges.east.bottom - margin }, // East-bottom point
      { x: edges.south.right - margin, y: intersectionSize - margin }, // South-right point
      { x: edges.south.left + margin, y: intersectionSize - margin }, // South-left point
      { x: margin, y: edges.west.bottom - margin }, // West-bottom point
      { x: margin, y: edges.west.top + margin }, // West-top point
    ];
    const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <svg
        className="absolute"
        // style={{ transform: `rotate(${config.angle}deg)` }}
        width={intersectionSize}
        height={intersectionSize}
      >
        {/* Fill the intersection area */}

        <polygon points={pointsString} className="fill-blue-gray-700" />

        {/* Draw the octagonal lines */}
        {/* North-West Diagonal */}
        <line
          x1={edges.north.left + roadEdgeDistance}
          y1={0}
          x2={0}
          y2={edges.west.top + roadEdgeDistance}
          stroke="none"
          strokeWidth="4"
        />
        {/* North-East Diagonal */}
        <line
          x1={edges.north.right - roadEdgeDistance}
          y1={0}
          x2={intersectionSize}
          y2={edges.east.top + roadEdgeDistance}
          stroke="none"
          strokeWidth="4"
        />
        {/* South-West Diagonal */}
        <line
          x1={edges.south.left + roadEdgeDistance}
          y1={intersectionSize}
          x2={0}
          y2={edges.west.bottom - roadEdgeDistance}
          stroke="none"
          strokeWidth="4"
        />
        {/* South-East Diagonal */}
        <line
          x1={edges.south.right - roadEdgeDistance}
          y1={intersectionSize}
          x2={intersectionSize}
          y2={edges.east.bottom - roadEdgeDistance}
          stroke="none"
          strokeWidth="4"
        />
      </svg>
    );
  };

  return (
    <div
      className="relative w-2/3 ml-auto h-full flex items-center justify-center"
      style={{ transform: `rotate(${config.angle}deg)` }}
    >
      <div
        className="absolute rounded-ful"
        style={{
          width: `${intersectionSize}px`,
          height: `${intersectionSize}px`,
          top: `calc(50% - ${intersectionSize / 2}px)`,
          left: `calc(50% - ${intersectionSize / 2}px)`,
        }}
      >
        <IntersectionArrows trafficLights={trafficLights} />
        {renderIntersectionBoundary()}
      </div>

      {/* Rendering North and South Roads */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.north)}px`,
          height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          top: 0,
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
          bottom: 0,
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
          left: 0,
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
          right: 0,
          top: `calc(50% - ${getRoadWidth(config.east) / 2}px)`,
        }}
      >
        {renderLanes("horizontal", "east")}
        {renderCrosswalks(config.east, "horizontal", "east")}
      </div>
    </div>
  );
};

export default Intersection;
