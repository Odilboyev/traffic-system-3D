import React, { useState } from "react";

const RoadDrawing = () => {
  // Single state object for all road configurations
  const [config, setConfig] = useState({
    north: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    south: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    east: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    west: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    northeast: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    northwest: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    southeast: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    southwest: {
      lanesPerDirection: 4,
      laneWidth: 10,
    },
    sidewalkWidth: 10,
  });

  // Calculate the intersection size dynamically
  const getIntersectionSize = () => {
    const maxWidth = Math.max(
      config.north.lanesPerDirection * config.north.laneWidth +
        config.sidewalkWidth * 2,
      config.south.lanesPerDirection * config.south.laneWidth +
        config.sidewalkWidth * 2,
      config.east.lanesPerDirection * config.east.laneWidth +
        config.sidewalkWidth * 2,
      config.west.lanesPerDirection * config.west.laneWidth +
        config.sidewalkWidth * 2
    );
    const maxHeight = Math.max(
      config.east.lanesPerDirection * config.east.laneWidth +
        config.sidewalkWidth * 2,
      config.west.lanesPerDirection * config.west.laneWidth +
        config.sidewalkWidth * 2
    );
    return Math.max(maxWidth, maxHeight);
  };

  const renderLanes = (roadConfig, direction) => {
    const { lanesPerDirection, laneWidth } = roadConfig;
    const totalLanes = lanesPerDirection * 2;
    const splitIndex = Math.ceil(totalLanes / 2);

    return (
      <div
        className={`flex ${
          direction === "horizontal" ? "flex-col" : "flex-row"
        } relative`}
        style={{
          minWidth: direction === "vertical" ? `${laneWidth}px` : "100%",
          minHeight: direction === "horizontal" ? `${laneWidth}px` : "100%",
        }}
      >
        {Array.from({ length: totalLanes }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: i < splitIndex ? "#444" : "#888",
              minWidth: direction === "vertical" ? `${laneWidth}px` : "100%",
              minHeight: direction === "horizontal" ? `${laneWidth}px` : "100%",
              [direction === "vertical" ? "borderRight" : "borderBottom"]:
                i < totalLanes - 1 ? "1px dashed white" : "none",
              position: "relative",
            }}
          />
        ))}
      </div>
    );
  };

  const renderSidewalks = (direction) => (
    <div
      className={`absolute bg-gray-300`}
      style={{
        [direction === "vertical"
          ? "width"
          : "height"]: `${config.sidewalkWidth}px`,
        [direction === "vertical" ? "height" : "width"]: "100%",
        boxShadow: "0 0 5px rgba(0,0,0,0.5)",
      }}
    />
  );

  const intersectionSize = getIntersectionSize();

  return (
    <div className="relative h-[90vh] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${
              config.north.laneWidth * config.north.lanesPerDirection +
              config.sidewalkWidth * 2
            }px`,
            height: "50%",
            top: 0,
          }}
        >
          {renderLanes(config.north, "vertical")}
        </div>

        {/* South Road */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            width: `${
              config.south.laneWidth * config.south.lanesPerDirection +
              config.sidewalkWidth * 2
            }px`,
            height: "50%",
            top: `50%`,
          }}
        >
          {renderLanes(config.south, "vertical")}
        </div>

        {/* East Road */}
        <div
          className="absolute flex flex-row items-center"
          style={{
            height: `${
              config.east.laneWidth * config.east.lanesPerDirection +
              config.sidewalkWidth * 2
            }px`,
            width: "50%",
            left: 0,
          }}
        >
          {renderLanes(config.east, "horizontal")}
        </div>

        {/* West Road */}
        <div
          className="absolute flex flex-row items-center"
          style={{
            height: `${
              config.west.laneWidth * config.west.lanesPerDirection +
              config.sidewalkWidth * 2
            }px`,
            width: "50%",
            left: `50%`,
          }}
        >
          {renderLanes(config.west, "horizontal")}
        </div>

        {/* Intersection */}
        <div
          className="absolute"
          style={{
            width: `${intersectionSize}px`,
            height: `${intersectionSize}px`,
            top: `calc(50% - ${intersectionSize / 2}px)`,
            left: `calc(50% - ${intersectionSize / 2}px)`,
            backgroundColor: "#333",
            boxShadow: "0 0 10px rgba(0,0,0,0.7)",
          }}
        >
          <Crosswalk orientation="horizontal" position="top" />
          <Crosswalk orientation="horizontal" position="bottom" />
          <Crosswalk orientation="vertical" position="left" />
          <Crosswalk orientation="vertical" position="right" />
        </div>
      </div>

      <div className="absolute top-10 right-10 p-4 rounded shadow-md bg-white dark:bg-blue-gray-600">
        <h2 className="text-lg font-semibold mb-4">Crossroad Controls</h2>

        {/* Controls for North Road */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">North Road</h3>
          <label className="block mb-2">
            Number of Lanes: {config.north.lanesPerDirection}
            <input
              type="range"
              min="1"
              max="6"
              value={config.north.lanesPerDirection}
              onChange={(e) =>
                setConfig({
                  ...config,
                  north: {
                    ...config.north,
                    lanesPerDirection: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Lane Width: {config.north.laneWidth}px
            <input
              type="range"
              min="10"
              max="100"
              value={config.north.laneWidth}
              onChange={(e) =>
                setConfig({
                  ...config,
                  north: {
                    ...config.north,
                    laneWidth: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>
        </div>

        {/* Controls for South Road */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">South Road</h3>
          <label className="block mb-2">
            Number of Lanes: {config.south.lanesPerDirection}
            <input
              type="range"
              min="1"
              max="6"
              value={config.south.lanesPerDirection}
              onChange={(e) =>
                setConfig({
                  ...config,
                  south: {
                    ...config.south,
                    lanesPerDirection: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Lane Width: {config.south.laneWidth}px
            <input
              type="range"
              min="10"
              max="100"
              value={config.south.laneWidth}
              onChange={(e) =>
                setConfig({
                  ...config,
                  south: {
                    ...config.south,
                    laneWidth: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>
        </div>

        {/* Controls for East Road */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">East Road</h3>
          <label className="block mb-2">
            Number of Lanes: {config.east.lanesPerDirection}
            <input
              type="range"
              min="1"
              max="6"
              value={config.east.lanesPerDirection}
              onChange={(e) =>
                setConfig({
                  ...config,
                  east: {
                    ...config.east,
                    lanesPerDirection: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Lane Width: {config.east.laneWidth}px
            <input
              type="range"
              min="10"
              max="100"
              value={config.east.laneWidth}
              onChange={(e) =>
                setConfig({
                  ...config,
                  east: {
                    ...config.east,
                    laneWidth: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>
        </div>

        {/* Controls for West Road */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">West Road</h3>
          <label className="block mb-2">
            Number of Lanes: {config.west.lanesPerDirection}
            <input
              type="range"
              min="1"
              max="6"
              value={config.west.lanesPerDirection}
              onChange={(e) =>
                setConfig({
                  ...config,
                  west: {
                    ...config.west,
                    lanesPerDirection: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Lane Width: {config.west.laneWidth}px
            <input
              type="range"
              min="10"
              max="100"
              value={config.west.laneWidth}
              onChange={(e) =>
                setConfig({
                  ...config,
                  west: {
                    ...config.west,
                    laneWidth: parseInt(e.target.value),
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>
        </div>

        {/* Sidewalk Width */}
        <div className="mb-4">
          <h3 className="text-md font-semibold">Sidewalk Width</h3>
          <label className="block mb-2">
            Width: {config.sidewalkWidth}px
            <input
              type="range"
              min="10"
              max="100"
              value={config.sidewalkWidth}
              onChange={(e) =>
                setConfig({
                  ...config,
                  sidewalkWidth: parseInt(e.target.value),
                })
              }
              className="w-full mt-1"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const Crosswalk = ({ orientation, position }) => {
  const style = {
    top: orientation === "horizontal" && position === "top" ? 0 : undefined,
    bottom:
      orientation === "horizontal" && position === "bottom" ? 0 : undefined,
    left: orientation === "vertical" && position === "left" ? 0 : undefined,
    right: orientation === "vertical" && position === "right" ? 0 : undefined,
    backgroundColor: "#888",
    height: orientation === "horizontal" ? "5px" : "100%",
    width: orientation === "vertical" ? "5px" : "100%",
    position: "absolute",
  };

  return <div style={style} />;
};

export default RoadDrawing;
