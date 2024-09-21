import { getLaneWidth, getRoadWidth } from "../utils";
import Crosswalk from "./crosswalk";
import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";

const Intersection = ({ config, trafficLights, crosswalks }) => {
  const getMaxRoadWidth = () => {
    return Math.max(getRoadWidth(config.east), getRoadWidth(config.west)) + 20;
  };
  const getIntersectionSize = () => {
    // Calculate maximum road width (lanesFrom or lanesTo, whichever is larger) plus sidewalks
    const maxWidth = Math.max(
      config.north.visible
        ? Math.max(config.north.lanesFrom, config.north.lanesTo) *
            getLaneWidth() +
            config.sidewalkWidth * 2
        : 0,
      config.south.visible
        ? Math.max(config.south.lanesFrom, config.south.lanesTo) *
            getLaneWidth() +
            config.sidewalkWidth * 2
        : 0
    );
    // Calculate maximum road height (lanesFrom or lanesTo, whichever is larger) plus sidewalks
    const maxHeight = Math.max(
      config.east.visible
        ? Math.max(config.east.lanesFrom, config.east.lanesTo) *
            getLaneWidth() +
            config.sidewalkWidth * 2
        : 0,
      config.west.visible
        ? Math.max(config.west.lanesFrom, config.west.lanesTo) *
            getLaneWidth() +
            config.sidewalkWidth * 2
        : 0
    );
    return Math.max(maxWidth, maxHeight);
  };
  const intersectionSize = getIntersectionSize() * 2.5;
  const renderLanes = (direction, roadName) => (
    <Lane
      lanesFrom={config[roadName].lanesFrom}
      lanesTo={config[roadName].lanesTo}
      direction={direction}
      roadName={roadName}
      trafficLights={trafficLights}
    />
  );

  const renderCrosswalks = (direction, roadConfig, roadName) => (
    <Crosswalk
      roadConfig={roadConfig}
      crosswalkStatus={crosswalks[roadName]}
      direction={direction}
      roadName={roadName}
    />
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute rounded-full scale-125 bg-blue-gray-700"
        style={{
          width: `${intersectionSize}px`,
          height: `${intersectionSize}px`,
          top: `calc(50% - ${intersectionSize / 2}px)`,
          left: `calc(50% - ${intersectionSize / 2}px)`,
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
        }}
      >
        <IntersectionArrows trafficLights={trafficLights} />
        {/* {renderCrosswalks()} */}
      </div>
      {/* {["north", "south", "east", "west"].map((direction, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{
            width: `${getRoadWidth(config[direction])}px`,
            height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            top: 0,
            left: `calc(50% - ${getRoadWidth(config[direction]) / 2}px)`,
          }}
        >
          {renderLanes(config[direction].direction, direction)}
          {renderCrosswalks(
            config[direction].direction,
            config[direction],
            direction
          )}
        </div>
      ))} */}
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
        {renderCrosswalks("vertical", config.north, "north")}
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
        {renderCrosswalks("vertical", config.south, "south")}
      </div>
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
        {renderCrosswalks("horizontal", config.west, "west")}
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
        {renderCrosswalks("horizontal", config.east, "east")}
      </div>
    </div>
  );
};

export default Intersection;
