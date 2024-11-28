import { getIntersectionSize, getRoadWidth } from "../utils";

import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";
import PropTypes from "prop-types";
import renderCrosswalks from "./crosswalk";

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
        seconds={seconds[roadName]}
      />
    );

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

  const renderIntersectionBoundary = () => {
    const edges = calculateEdges();

    const points = [
      { x: edges.north.left, y: 0 },
      { x: edges.north.right, y: 0 },
      { x: intersectionSize, y: edges.east.top },
      { x: intersectionSize, y: edges.east.bottom },
      { x: edges.south.right, y: intersectionSize },
      { x: edges.south.left, y: intersectionSize },
      { x: 0, y: edges.west.bottom },
      { x: 0, y: edges.west.top },
    ];

    const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
    return (
      <svg
        className="absolute"
        width={intersectionSize}
        height={intersectionSize}
      >
        <polygon points={pointsString} className="fill-blue-gray-700" />
      </svg>
    );
  };

  const calculateGlobalMargin = () => {
    const roads = [config.north, config.south, config.east, config.west];
    let totalMargin = 0;
    let samelengthCount = 0;

    const baseMargin = -40;
    const laneMultiplier = 10;

    for (const road of roads) {
      const lanesLeft = road.lanesLeft.length;
      const lanesRight = road.lanesRight.length;

      if (lanesLeft === lanesRight) {
        samelengthCount += 1;
      }
      if (samelengthCount >= 3) return 0;

      if (lanesLeft >= 3 && lanesRight >= 3) {
        if (Math.abs(lanesLeft - lanesRight) >= 2) {
          totalMargin = -(
            Math.abs(lanesLeft - lanesRight) * laneMultiplier +
            Math.abs(baseMargin)
          );
        } else {
          totalMargin = baseMargin;
        }
      }
    }
    return totalMargin;
  };

  const margin = calculateGlobalMargin();

  const verticalRoadLengthScale = 1;
  const verticalSpacingScale = 1;

  return (
    <div
      className={`relative no-scrollbar w-3/4 ml-0 left-0 h-full flex items-center justify-center overflow-hidden`}
      style={{
        transform: `rotate(${config.angle}deg)`,
      }}
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
          height: `calc(${verticalRoadLengthScale * 50}% - ${
            getMaxRoadWidth() / 2
          }px)`,
          top: `${margin * verticalSpacingScale}px`,
          left: `calc(50% - ${getRoadWidth(config.north) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "north")}
        {renderCrosswalks(
          config.north,
          "vertical",
          "north",
          crosswalks.north,
          crosswalkSeconds.north
        )}
      </div>
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.south)}px`,
          height: `calc(${verticalRoadLengthScale * 50}% - ${
            getMaxRoadWidth() / 2
          }px)`,
          bottom: `${margin * verticalSpacingScale}px`,
          left: `calc(50% - ${getRoadWidth(config.south) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "south")}
        {renderCrosswalks(
          config.south,
          "vertical",
          "south",
          crosswalks.south,
          crosswalkSeconds.south
        )}
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
        {renderCrosswalks(
          config.west,
          "horizontal",
          "west",
          crosswalks.west,
          crosswalkSeconds.west
        )}
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
        {renderCrosswalks(
          config.east,
          "horizontal",
          "east",
          crosswalks.east,
          crosswalkSeconds.east
        )}
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
