import React, { useState } from "react";
import TrafficLight from "./trafficLight"; // Adjust the import if needed

const RoadDrawing = () => {
  const [config, setConfig] = useState({
    north: { lanesFrom: 4, lanesTo: 2, visible: true },
    south: { lanesFrom: 2, lanesTo: 3, visible: true },
    east: { lanesFrom: 2, lanesTo: 2, visible: true },
    west: { lanesFrom: 2, lanesTo: 2, visible: true },
    sidewalkWidth: 10,
  });

  const getLaneWidth = () => 20; // Width of each lane
  const getRoadWidth = (roadConfig) => {
    return (roadConfig.lanesFrom + roadConfig.lanesTo) * getLaneWidth();
  };

  const getMaxRoadWidth = () => {
    return Math.max(
      getRoadWidth(config.north),
      getRoadWidth(config.south),
      getRoadWidth(config.east),
      getRoadWidth(config.west)
    );
  };

  const getResponsiveOctagonPoints = (scaleFactor) => {
    const basePoints = [
      [30, 0],
      [70, 0],
      [100, 30],
      [100, 70],
      [70, 100],
      [30, 100],
      [0, 70],
      [0, 30],
    ];
    return basePoints
      .map(([x, y]) => `${x * scaleFactor}px ${y * scaleFactor}px`)
      .join(", ");
  };

  const scaleFactor = getMaxRoadWidth() / 100;

  const renderLanes = (roadConfig, direction, roadName) => {
    const { lanesFrom, lanesTo, visible } = roadConfig;
    if (!visible) return null;

    const totalLanes = lanesFrom + lanesTo;
    const laneWidth = getLaneWidth();
    const roadLength = `calc(100% - ${getMaxRoadWidth() / 2}px)`;

    const getArrowForLane = (laneIndex, isIncoming) => {
      const laneDirection = roadName.toLowerCase();
      let arrow = "↑";
      if (laneDirection === "north") arrow = isIncoming ? "↑" : "↓";
      else if (laneDirection === "south") arrow = isIncoming ? "↑" : "↓";
      else if (laneDirection === "east") arrow = isIncoming ? "→" : "←";
      else if (laneDirection === "west") arrow = isIncoming ? "→" : "←";
      return arrow;
    };

    return (
      <div
        className={`relative flex ${
          direction === "horizontal" ? "flex-col" : "flex-row"
        }`}
        style={{
          width:
            direction === "vertical"
              ? `${laneWidth * totalLanes}px`
              : roadLength,
          height:
            direction === "horizontal"
              ? `${laneWidth * totalLanes}px`
              : roadLength,
          zIndex: 1,
        }}
      >
        {/* Incoming lanes */}
        {Array.from({ length: lanesFrom }).map((_, i) => (
          <div
            key={`in-${i}`}
            className={`flex ${
              roadName === "north"
                ? "items-end"
                : roadName === "west"
                ? "justify-end"
                : ""
            }`}
            style={{
              backgroundColor: "#444",
              [direction === "vertical" ? "borderRight" : "borderBottom"]:
                i < lanesFrom - 1 ? "1px dashed white" : "none",

              textAlign: "center",
              lineHeight: `${laneWidth}px`,
            }}
          >
            <span
              style={{
                zIndex: 50,
                fontSize: "14px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {getArrowForLane(i, true)}
            </span>
          </div>
        ))}

        {/* Outgoing lanes */}
        {Array.from({ length: lanesTo }).map((_, i) => (
          <div
            key={`out-${i}`}
            className={`flex ${
              roadName === "north"
                ? "items-end"
                : roadName === "west"
                ? "justify-end"
                : ""
            }`}
            style={{
              backgroundColor: "#888",
              [direction === "vertical" ? "borderRight" : "borderBottom"]:
                i < lanesFrom - 1 ? "1px dashed white" : "none",
              position: "relative",
              textAlign: "center",
              lineHeight: `${laneWidth}px`,
            }}
          >
            <span
              style={{
                zIndex: 50,
                display: "inline-block",
                fontSize: "14px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {getArrowForLane(i, false)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative h-[90vh] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${getRoadWidth(config.north)}px`,
            height: "50%",
            top: 0,
            left: `calc(50% - ${getRoadWidth(config.north) / 2}px)`,
          }}
        >
          {renderLanes(config.north, "vertical", "north")}
          <TrafficLight
            position={{
              top: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
              left: `calc(${getRoadWidth(config.north) / 2 - 20}px)`,
            }}
            rotate={{ transform: "rotate(90deg)" }}
          />
        </div>

        {/* South Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${getRoadWidth(config.south)}px`,
            height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            bottom: 0,
            left: `calc(50% - ${getRoadWidth(config.south) / 2}px)`,
          }}
        >
          {renderLanes(config.south, "vertical", "south")}
          <TrafficLight
            position={{
              top: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
              left: `calc(${getRoadWidth(config.south) / 2 - 20}px)`,
            }}
            rotate={{ transform: "rotate(90deg)" }}
          />
        </div>

        {/* East Road */}
        <div
          className="absolute flex flex-row items-center"
          style={{
            height: `${getRoadWidth(config.east)}px`,
            width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            right: 0,
            top: `calc(50% - ${getRoadWidth(config.east) / 2}px)`,
          }}
        >
          {renderLanes(config.east, "horizontal", "east")}
          <TrafficLight
            position={{
              top: `calc(${getRoadWidth(config.east) / 2 - 20}px)`,
              left: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
            }}
          />
        </div>

        {/* West Road */}
        <div
          className="absolute flex flex-row items-center"
          style={{
            height: `${getRoadWidth(config.west)}px`,
            width: "50%",
            left: 0,
            top: `calc(50% - ${getRoadWidth(config.west) / 2}px)`,
          }}
        >
          {renderLanes(config.west, "horizontal", "west")}
          <TrafficLight
            position={{
              top: `calc(${getRoadWidth(config.west) / 2 - 20}px)`,
              left: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
            }}
          />
        </div>

        {/* Center Intersection */}
        <div
          className="absolute"
          style={{
            width: `${getMaxRoadWidth()}px`,
            height: `${getMaxRoadWidth()}px`,
            top: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            left: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            clipPath: `polygon(${getResponsiveOctagonPoints(scaleFactor)})`,
            backgroundColor: "#222",
            zIndex: 0,
          }}
        />
      </div>
    </div>
  );
};

export default RoadDrawing;
