import PropTypes from "prop-types";
import {
  getCrosswalkWidth,
  getIntersectionSize,
  getRoadWidth,
  getLaneWidth,
} from "../utils";
import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";
import renderCrosswalks from "./crosswalk";

const Intersection = ({
  id,
  isInModal,
  config,
  trafficLights,
  crosswalks,
  seconds = {},
  crosswalkSeconds = {},
}) => {
  const getMaxRoadWidth = () => {
    return (
      Math.max(
        getRoadWidth(config.north, isInModal),
        getRoadWidth(config.south, isInModal),
        getRoadWidth(config.east, isInModal),
        getRoadWidth(config.west, isInModal)
      ) + (isInModal ? 12 : 20)
    );
  };

  const intersectionSize = getIntersectionSize(config, isInModal);
  const laneWidth = getLaneWidth(isInModal);

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
        isInModal={isInModal}
      />
    );

  const roadWidthNorth = getRoadWidth(config.north, isInModal);
  const roadWidthSouth = getRoadWidth(config.south, isInModal);
  const roadWidthEast = getRoadWidth(config.east, isInModal);
  const roadWidthWest = getRoadWidth(config.west, isInModal);

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
        <polygon points={pointsString} className="fill-blue-gray-700" />
      </svg>
    );
  };

  // Function to calculate the margin based on any road having uneven lanes
  const calculateGlobalMargin = () => {
    const roads = [config.north, config.south, config.east, config.west];
    let totalMargin = 0;
    let samelengthCount = 0;

    // Base margin value adjusted for modal
    const baseMargin = isInModal ? -24 : -40;
    // Lane difference multiplier adjusted for modal
    const laneMultiplier = isInModal ? 6 : 10;

    // Loop through all roads
    for (const road of roads) {
      const lanesLeft = road.lanesLeft.length;
      const lanesRight = road.lanesRight.length;

      if (lanesLeft === lanesRight) {
        samelengthCount += 1;
      }
      if (samelengthCount >= 3) return 0;

      if (lanesLeft >= 3 && lanesRight >= 3) {
        if (Math.abs(lanesLeft - lanesRight) >= 2) {
          // Set the margin based on the difference, scaled for modal
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

  // Calculate margin once
  const margin = calculateGlobalMargin();

  // Add a scale factor only for vertical roads in modal
  const verticalRoadLengthScale = isInModal ? 0.6 : 1; // Changed from 0.6 to 0.4
  const verticalSpacingScale = isInModal ? 0.7 : 1; // Changed from 0.7 to 0.5

  return (
    <div
      className={`relative ${
        id ? "w-full" : "w-2/3"
      } h-full flex items-center justify-center overflow-hidden`}
      style={{
        transform: `rotate(${config.angle}deg)`,
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          width: `${intersectionSize}px`,
          height: `${intersectionSize}px`,
          top: isInModal
            ? `calc(30% - ${intersectionSize / 2}px)` // Changed from 35% to 30%
            : `calc(50% - ${intersectionSize / 2}px)`, // Center normally
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

      {/* Rendering North and South Roads - with scaled length and adjusted spacing */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.north, isInModal)}px`,
          height: `calc(${verticalRoadLengthScale * 50}% - ${
            getMaxRoadWidth() / 2
          }px)`,
          top: isInModal
            ? `calc(30% - ${intersectionSize / 2}px - ${
                getMaxRoadWidth() / 2
              }px)` // Changed from 35% to 30%
            : `${margin * verticalSpacingScale}px`,
          left: `calc(50% - ${getRoadWidth(config.north, isInModal) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "north")}
        {renderCrosswalks(
          config.north,
          "vertical",
          "north",
          crosswalks,
          crosswalkSeconds,
          isInModal
        )}
      </div>
      <div
        className="absolute flex flex-col items-center"
        style={{
          width: `${getRoadWidth(config.south, isInModal)}px`,
          height: `calc(${verticalRoadLengthScale * 50}% - ${
            getMaxRoadWidth() / 2
          }px)`,
          top: isInModal
            ? `calc(30% + ${intersectionSize / 2}px)` // Changed from 35% to 30%
            : `auto`,
          bottom: isInModal ? "auto" : `${margin * verticalSpacingScale}px`,
          left: `calc(50% - ${getRoadWidth(config.south, isInModal) / 2}px)`,
        }}
      >
        {renderLanes("vertical", "south")}
        {renderCrosswalks(
          config.south,
          "vertical",
          "south",
          crosswalks,
          crosswalkSeconds,
          isInModal
        )}
      </div>

      {/* Rendering East and West Roads - unchanged length */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          height: `${getRoadWidth(config.west, isInModal)}px`,
          width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          left: margin,
          top: isInModal
            ? `calc(30% - ${getRoadWidth(config.west, isInModal) / 2}px)` // Changed from 35% to 30%
            : `calc(50% - ${getRoadWidth(config.west, isInModal) / 2}px)`,
        }}
      >
        {renderLanes("horizontal", "west")}
        {renderCrosswalks(
          config.west,
          "horizontal",
          "west",
          crosswalks,
          crosswalkSeconds,
          isInModal
        )}
      </div>
      <div
        className="absolute flex flex-col items-center"
        style={{
          height: `${getRoadWidth(config.east, isInModal)}px`,
          width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
          right: margin,
          top: isInModal
            ? `calc(30% - ${getRoadWidth(config.east, isInModal) / 2}px)` // Changed from 35% to 30%
            : `calc(50% - ${getRoadWidth(config.east, isInModal) / 2}px)`,
        }}
      >
        {renderLanes("horizontal", "east")}
        {renderCrosswalks(
          config.east,
          "horizontal",
          "east",
          crosswalks,
          crosswalkSeconds,
          isInModal
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
