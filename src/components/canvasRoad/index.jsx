import React, { useEffect, useState } from "react";
import TrafficLight from "./trafficLight"; // Adjust the import if needed
import { TbArrowRampLeft, TbArrowRampRight } from "react-icons/tb";

const RoadDrawing = () => {
  const [config, setConfig] = useState({
    north: { lanesFrom: 4, lanesTo: 2, visible: true },
    south: { lanesFrom: 2, lanesTo: 3, visible: true },
    east: { lanesFrom: 4, lanesTo: 4, visible: true },
    west: { lanesFrom: 2, lanesTo: 3, visible: true },
    sidewalkWidth: 10,
  });
  const [trafficLights, setTrafficLights] = useState({
    north: "red",
    south: "red",
    east: "green",
    west: "green",
  });

  const [crosswalks, setCrosswalks] = useState({
    north: "green",
    south: "green",
    east: "red",
    west: "red",
  });
  const colorMappingText = {
    green: "text-green",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLights((prev) => ({
        north: prev.north === "red" ? "green" : "red",
        south: prev.south === "red" ? "green" : "red",
        east: prev.east === "red" ? "green" : "red",
        west: prev.west === "red" ? "green" : "red",
      }));

      setCrosswalks((prev) => ({
        north: prev.north === "green" ? "red" : "green",
        south: prev.south === "green" ? "red" : "green",
        east: prev.east === "red" ? "green" : "red",
        west: prev.west === "red" ? "green" : "red",
      }));
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getLaneWidth = () => 40; // Width of each lane
  const getRoadWidth = (roadConfig) => {
    return (roadConfig.lanesFrom + roadConfig.lanesTo) * getLaneWidth();
  };

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

  // Now get the intersection size
  const intersectionSize = getIntersectionSize() * 2.5;

  const renderLanes = (roadConfig, direction, roadName) => {
    const { lanesFrom, lanesTo, visible } = roadConfig;
    if (!visible) return null;

    const totalLanes = lanesFrom + lanesTo;
    const laneWidth = getLaneWidth();
    const roadLength = `calc(100%)`;

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
        {/* Lanes */}
        {Array.from({ length: totalLanes }).map((_, i) => {
          const isOutgoing = i >= lanesFrom; // Determine if it's an outgoing lane
          const isRightmost = i === totalLanes - 1; // Check if it's the rightmost lane
          const isLeftmost = i === 0; // Check if it's the leftmost lane

          let icon = null; // Initialize icon as null

          // Render icons only for outgoing lanes (lanesTo)

          if (roadName === "north") {
            if (!isOutgoing) {
              icon = isRightmost ? (
                <TbArrowRampLeft className="rotate-180 " />
              ) : isLeftmost ? (
                <TbArrowRampRight className="rotate-180 " />
              ) : (
                "↓"
              );
            }
          } else if (roadName === "south") {
            if (isOutgoing) {
              icon = isRightmost ? (
                <TbArrowRampRight />
              ) : isLeftmost ? (
                <TbArrowRampLeft />
              ) : (
                "↑"
              );
            }
          } else if (roadName === "east") {
            if (!isOutgoing) {
              icon = isRightmost ? (
                <TbArrowRampLeft className="-rotate-90" />
              ) : isLeftmost ? (
                <TbArrowRampRight className="-rotate-90" />
              ) : (
                "←"
              );
            }
          } else if (roadName === "west") {
            if (isOutgoing) {
              icon = isRightmost ? (
                <TbArrowRampRight className="rotate-90" />
              ) : isLeftmost ? (
                <TbArrowRampLeft />
              ) : (
                "→"
              );
            }
          }
          return (
            <div
              key={i}
              className={`flex ${
                roadName === "north" ? "items-end " : "items-start"
              } ${roadName === "west" ? "justify-end" : "justify-start"} ${
                isOutgoing ? "bg-blue-gray-500" : "bg-blue-gray-700"
              }`}
              style={{
                // backgroundColor: isOutgoing ? "#444" : "#888",
                width: direction === "vertical" ? `${laneWidth}px` : "100%",
                height: direction === "horizontal" ? `${laneWidth}px` : "100%",
                textAlign: "center",
                lineHeight: `${laneWidth}px`,
                [direction === "vertical" ? "borderRight" : "borderBottom"]:
                  i < totalLanes ? "1px dashed white" : "none",
              }}
            >
              <span
                className={`${
                  colorMappingText[trafficLights[roadName]]
                } font-bold text-2xl`}
                style={{
                  zIndex: 50,
                  padding: direction === "vertical" ? "40px 5px" : "0px 40px",
                }}
              >
                {icon}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  const renderCrosswalks = (roadConfig, direction, roadName) => {
    const laneWidth = getLaneWidth(); // Replace with your  if needed
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
  const renderArrows = () => {
    return (
      <div
        className="absolute flex flex-col items-center justify-center w-full h-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* North-South Arrows */}

        <div
          className={`flex text-white font-bold text-5xl ${
            trafficLights.east === "green" ? "flex-col" : "flex-row"
          }`}
        >
          {trafficLights.east === "green" ? (
            <>
              <span>←</span> <span>→</span>{" "}
            </>
          ) : (
            <>
              <span>↑</span>
              <span>↓</span>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleRoadChange = (direction, field, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const jsonOutput = JSON.stringify(config, null, 2);
    console.log("Crossroad Configuration:", jsonOutput);
    // You can further process the jsonOutput, like sending it to an API
  };

  return (
    <div className="relative h-[90vh]  flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute top-0 left-0 p-4 bg-white shadow-md">
          {["north", "south", "east", "west"].map((direction) => (
            <div key={direction} className="flex items-center mb-2">
              <span className="mr-2 capitalize">{direction}:</span>
              <input
                type="number"
                value={
                  config[direction].lanesFrom === 0
                    ? ""
                    : config[direction].lanesFrom
                }
                onChange={(e) =>
                  handleRoadChange(direction, "lanesFrom", +e.target.value)
                }
                min={0}
                className="border p-1 w-12"
              />
              <span className="mx-1">from</span>
              <input
                type="number"
                value={
                  config[direction].lanesTo === 0
                    ? ""
                    : config[direction].lanesTo
                }
                onChange={(e) =>
                  handleRoadChange(direction, "lanesTo", +e.target.value)
                }
                min={0}
                className="border p-1 w-12"
              />
              <span className="mx-1">to</span>
              <input
                id={"check" + direction}
                type="checkbox"
                checked={config[direction].visible}
                onChange={(e) =>
                  handleRoadChange(direction, "visible", e.target.checked)
                }
                className="ml-2"
              />
              <label htmlFor={"check" + direction} className="ml-1 select-none">
                Visible
              </label>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>

        {/* rendering the roads */}
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
          {config.north.visible && (
            <TrafficLight
              position={{
                top: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
                left: `calc(${getRoadWidth(config.north) / 2 - 20}px)`,
              }}
              rotate={{ transform: "rotate(90deg)" }}
            />
          )}
          {renderCrosswalks(config.north, "vertical", "north")}
        </div>

        {/* South Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${getRoadWidth(config.south)}px`,
            height: `calc(50% - ${getMaxRoadWidth() / 2}px)`,
            bottom: 0,
          }}
        >
          {renderLanes(config.south, "vertical", "south")}
          {config.south.visible && (
            <TrafficLight
              position={{
                top: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
                left: `calc(${getRoadWidth(config.south) / 2 - 20}px)`,
              }}
              rotate={{ transform: "rotate(90deg)" }}
            />
          )}
          {renderCrosswalks(config.south, "vertical", "south")}
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
          {config.east.visible && (
            <TrafficLight
              position={{
                top: `calc(${getRoadWidth(config.east) / 2 - 20}px)`,
                left: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
              }}
            />
          )}
          {renderCrosswalks(config.east, "horizontal", "east")}
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
          {config.west.visible && (
            <TrafficLight
              position={{
                top: `calc(${getRoadWidth(config.west) / 2 - 20}px)`,
                left: `calc(${getMaxRoadWidth() / 2 - 20}px)`,
              }}
            />
          )}
          {renderCrosswalks(config.west, "horizontal", "west")}
        </div>
        {/* Center Intersection */}

        {/* Center Intersection */}
        {/* Intersection */}
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
          {renderArrows()}
          {/* {renderCrosswalks()} */}
        </div>
      </div>
    </div>
  );
};

export default RoadDrawing;
