import React, { useState } from "react";

const RoadDrawing = () => {
  const [lanes, setLanes] = useState(6); // Number of lanes per direction
  const [laneWidth, setLaneWidth] = useState(50); // Width of a single lane
  const [sidewalkWidth, setSidewalkWidth] = useState(10); // Width of the sidewalk
  const [intersectionSize, setIntersectionSize] = useState(200); // Size of the intersection

  const renderLanes = (direction) => {
    return (
      <div
        className={`flex border-4 ${
          direction == "horizontal" ? "flex-col" : "flex-row"
        } border-red-300`}
        style={{
          minWidth: direction === "vertical" ? `${laneWidth}px` : "100%",
          minHeight: direction === "horizontal" ? `${laneWidth}px` : "100%",
        }}
      >
        {Array.from({ length: lanes }).map((_, i) => (
          <dive
            key={i}
            style={{
              backgroundColor: "#666", // Gray color for lanes
              minWidth: direction === "vertical" ? `${laneWidth}px` : "100%",
              minHeight: direction === "horizontal" ? `${laneWidth}px` : "100%",
              // height: "100%",
              // transform: direction === "horizontal" && "rotate(90deg)",
              margin: "", // No gap between lanes
              border: "3px solid white  ",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Vertical Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${laneWidth * lanes + sidewalkWidth * 2}px`,
            height: "100%",
          }}
        >
          {/* Vertical Lanes */}
          {renderLanes("vertical")}
        </div>

        {/* Horizontal Road */}
        <div
          className="absolute flex flex-row items-center" // flex col qilish kk - horizontal uchun kk
          style={{
            height: `${laneWidth * lanes + sidewalkWidth * 2}px`,
            width: "100%",
          }}
        >
          {/* Horizontal Lanes */}
          {renderLanes("horizontal")}
        </div>

        {/* Intersection */}
        <div
          className="absolute"
          style={{
            width: `${intersectionSize}px`,
            height: `${intersectionSize}px`,
            top: `calc(50% - ${intersectionSize / 2}px)`,
            left: `calc(50% - ${intersectionSize / 2}px)`,
            backgroundColor: "#333", // Dark gray for intersection
            // border: "2px solid #fff", // White border for visibility
          }}
        >
          {/* Crosswalks */}
          <div
            className="absolute"
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#fff", // White for crosswalks
              top: "50%",
              left: "0",
              transform: "translateY(-50%)",
            }}
          />
          <div
            className="absolute"
            style={{
              height: "100%",
              width: "10px",
              backgroundColor: "#fff", // White for crosswalks
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      <div className="absolute top-10 right-10 p-4 rounded shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-4">Crossroad Controls</h2>

        <label className="block mb-2">
          Number of Lanes: {lanes}
          <input
            type="range"
            min="1"
            max="6"
            value={lanes}
            onChange={(e) => setLanes(parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <label className="block mb-2">
          Lane Width: {laneWidth}px
          <input
            type="range"
            min="30"
            max="100"
            value={laneWidth}
            onChange={(e) => setLaneWidth(parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <label className="block mb-2">
          Sidewalk Width: {sidewalkWidth}px
          <input
            type="range"
            min="10"
            max="50"
            value={sidewalkWidth}
            onChange={(e) => setSidewalkWidth(parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <label className="block mb-2">
          Intersection Size: {intersectionSize}px
          <input
            type="range"
            min="100"
            max="300"
            value={intersectionSize}
            onChange={(e) => setIntersectionSize(parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </label>
      </div>
    </div>
  );
};

export default RoadDrawing;
