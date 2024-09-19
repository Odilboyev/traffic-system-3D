import React, { useState } from "react";
import TrafficLight from "./trafficLight"; // Adjust the import if needed

const RoadDrawing = () => {
  const [config, setConfig] = useState({
    north: { lanesFrom: 4, lanesTo: 2, visible: true },
    south: { lanesFrom: 2, lanesTo: 3, visible: true },
    east: { lanesFrom: 4, lanesTo: 4, visible: true },
    west: { lanesFrom: 2, lanesTo: 3, visible: true },
    sidewalkWidth: 10,
  });

  const getLaneWidth = () => 20; // Width of each lane
  const getRoadWidth = (roadConfig) => {
    return (roadConfig.lanesFrom + roadConfig.lanesTo) * getLaneWidth();
  };

  const getMaxRoadWidth = () => {
    return Math.max(getRoadWidth(config.east), getRoadWidth(config.west)) + 20;
  };

  const getMaxRoadHeight = () => {
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

  // Now get the intersection size
  const intersectionSize = getIntersectionSize() * 2;

  const getResponsiveOctagonPoints = () => {
    // Road-specific widths
    const roadWidthNorth = getRoadWidth(config.north);
    const roadWidthSouth = getRoadWidth(config.south);
    const roadWidthEast = getRoadWidth(config.east);
    const roadWidthWest = getRoadWidth(config.west);

    // Calculate the maximum width and height for the octagon
    const maxWidth = Math.max(roadWidthEast, roadWidthWest);
    const maxHeight = Math.max(roadWidthNorth, roadWidthSouth);

    // Base dimensions for the octagon based on manual adjustments
    const baseWidth = 160;
    const baseHeight = 160;

    // Calculate scaling factors
    const scaleX = maxWidth / baseWidth;
    const scaleY = maxHeight / baseHeight;

    // Define the base points for the octagon
    const basePoints = [
      [20, 0],
      [160, 0],
      [400, 180],
      [125, 220],
      [35, 220],
      [0, 173],
      [0, 40],
    ];

    // Scale the points based on the scaling factors
    const scaledPoints = basePoints.map(([x, y]) => [x * scaleX, y * scaleY]);

    // Convert points to the clipPath format
    return scaledPoints.map(([x, y]) => `${x}px ${y}px`).join(", ");
  };

  const scaleFactorX = getMaxRoadWidth() / 100;
  const scaleFactorY = getMaxRoadHeight() / 100; // Use height scaling

  const renderLanes = (roadConfig, direction, roadName) => {
    const { lanesFrom, lanesTo, visible } = roadConfig;
    if (!visible) return null;

    const totalLanes = lanesFrom + lanesTo;
    const laneWidth = getLaneWidth();
    const roadLength = `calc(100%)`;

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
        className={`relative z-20 flex ${
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
        }}
      >
        {/* Incoming lanes */}
        {Array.from({ length: lanesFrom }).map((_, i) => (
          <div
            key={`in-${i}`}
            className={`flex  ${
              roadName === "north"
                ? "items-end justify-center"
                : roadName === "west"
                ? "justify-end items-center"
                : ""
            }`}
            style={{
              backgroundColor: "#888",
              [direction === "vertical" ? "borderRight" : "borderBottom"]:
                i < lanesFrom ? "1px dashed white" : "none",
              width: direction === "vertical" ? `${laneWidth}px` : "100%",
              height: direction === "horizontal" ? `${laneWidth}px` : "100%",

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
              {/* {getArrowForLane(i, false)} */}
            </span>
          </div>
        ))}

        {/* Outgoing lanes */}
        {Array.from({ length: lanesTo }).map((_, i) => (
          <div
            key={`out-${i}`}
            className={`flex ${
              roadName === "north"
                ? "items-end justify-center"
                : roadName === "west"
                ? "justify-end items-center"
                : ""
            }`}
            style={{
              width: direction === "vertical" ? `${laneWidth}px` : "100%",
              height: direction === "horizontal" ? `${laneWidth}px` : "100%",

              backgroundColor: "#444",
              [direction === "vertical" ? "borderRight" : "borderBottom"]:
                i < lanesFrom ? "1px dashed white" : "none",
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
              {getArrowForLane(i, true)}
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
            height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
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
            // left: `calc(50% - ${getRoadWidth(config.south) / 2}px)`,
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
            width: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
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

        {/* Center Intersection */}
        {/* Intersection */}
        <div
          className="absolute"
          style={{
            width: `${intersectionSize}px`,
            height: `${intersectionSize}px`,
            top: `calc(50% - ${intersectionSize / 2}px)`,
            left: `calc(50% - ${intersectionSize / 2}px)`,
            backgroundColor: "#484747",
            boxShadow: "0 0 10px rgba(0,0,0,0.7)",
            // zIndex: 2,
          }}
        >
          {/* Crosswalks */}
        </div>
      </div>
    </div>
  );
};

export default RoadDrawing;
