import { getIntersectionSize, getLaneWidth, getRoadWidth } from "../utils";
import Crosswalk from "./crosswalk";
import IntersectionArrows from "./intersectionArrows";
import Lane from "./lane";
import Road from "./road";

const Intersection = ({ config, trafficLights, crosswalks }) => {
  const getMaxRoadWidth = () => {
    return Math.max(getRoadWidth(config.east), getRoadWidth(config.west)) + 20;
  };

  const intersectionSize = getIntersectionSize(config) * 2.5;
  const renderLanes = (direction, roadName) =>
    config[roadName].visible && (
      <Lane
        lanesFrom={config[roadName].lanesFrom}
        lanesTo={config[roadName].lanesTo}
        direction={direction}
        roadName={roadName}
        trafficLights={trafficLights}
      />
    );
  const renderCrosswalks = (roadConfig, direction, roadName) => {
    const laneWidth = 10; // Replace with your  if needed
    const crosswalkWidth = getRoadWidth(roadConfig); // Replace with getRoadWidth(roadConfig) if needed
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

    return (
      <div
        className={`absolute `}
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
        <Road
          key={i}
              direction={config[direction].direction}
              
          renderCrosswalks={
            <Crosswalk
              roadConfig={config[direction]}
              crosswalkStatus={crosswalks[direction]}
              direction={config[direction].direction}
              roadName={direction}
            />
          }
          renderLanes={renderLanes}
          config={direction}
        />
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
