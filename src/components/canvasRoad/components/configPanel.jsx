import React, { useState } from "react";
import {
  TbArrowBack,
  TbArrowDown,
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowUp,
} from "react-icons/tb";
import { iconOptions } from "../utils";
import { Option, Select } from "@material-tailwind/react";

const ConfigPanel = ({ config, setConfig }) => {
  const handleRoadChange = (direction, field, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        [field]: value,
      },
    }));
  };
  const getLaneIcons = (count) => {
    const baseIcons = ["TbArrowBack", "TbArrowUp"]; // Always include these icons
    const rightIcon = "TbArrowRampRight"; // Always the right icon
    const icons = [];

    // Push the base icons
    icons.push(...baseIcons);

    // Add the appropriate number of up icons based on the count
    for (let i = 0; i <= count - 1; i++) {
      icons.push("TbArrowUp"); // Add up icons for the left lanes
    }

    // Add the right icon at the end
    icons.push(rightIcon);

    return icons;
  };

  const updateLaneCount = (direction, side, count) => {
    setConfig((prev) => {
      const existingLanes = config[direction][side] || [];
      const newLanes = getLaneIcons(count)?.map((icon) => ({
        icon: icon,
      }));
      return {
        ...prev,
        [direction]: {
          ...prev[direction],
          [side]: newLanes,
        },
      };
    });
  };

  const handleIconChange = (direction, side, laneIndex, value) => {
    setConfig((prevConfig) => {
      const updatedLanes = [...prevConfig[direction][side]];
      updatedLanes[laneIndex] = { icon: value }; // Update the specific lane icon
      return {
        ...prevConfig,
        [direction]: {
          ...prevConfig[direction],
          [side]: updatedLanes,
        },
      };
    });
  };
  const handleAngleChange = (value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      angle: value,
    }));
  };

  const handleSubmit = () => {
    const jsonOutput = JSON.stringify(config, null, 2);
    console.log("Crossroad Configuration:", jsonOutput);
  };

  return (
    <div className="absolute top-0 left-0 p-4 border shadow-md z-50 h-full">
      {/* Angle Control */}
      <div className="flex items-center mb-4">
        <span className="mr-2">Angle:</span>
        <input
          type="range"
          min={0}
          max={360}
          value={config.angle}
          onChange={(e) => handleAngleChange(+e.target.value)}
          className="w-full mx-2"
        />
        <span>{config.angle}°</span>
      </div>
      {["north", "south", "east", "west"].map((direction) => (
        <div key={direction} className="flex flex-col items-start mb-4">
          <div className="flex items-center mb-2">
            <span className="mr-2 capitalize">{direction}:</span>

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

          {/* Lane Count Controls */}
          <div className="flex items-center mb-2">
            <span className="mr-2">Lanes Left:</span>
            <input
              type="number"
              value={
                config[direction].lanesLeft.length === 0
                  ? ""
                  : config[direction].lanesLeft.length
              }
              onChange={(e) =>
                updateLaneCount(direction, "lanesLeft", +e.target.value)
              }
              min={0}
              className="border p-1 w-12"
            />
            <span className="ml-4">Lanes Right:</span>
            <input
              type="number"
              value={
                config[direction].lanesRight.length === 0
                  ? ""
                  : config[direction].lanesRight.length
              }
              onChange={(e) =>
                updateLaneCount(direction, "lanesRight", +e.target.value)
              }
              min={0}
              className="border p-1 w-12"
            />
          </div>

          {/* Lanes Icon Selection */}
          {/* <div>
            <span className="mr-2">Lane Icons (Left):</span>
            {config[direction].lanesLeft.map((lane, index) => (
              <select
                key={`left-${index}`}
                value={lane.value || ""}
                onChange={(e) =>
                  handleIconChange(direction, "lanesLeft", index, e)
                }
                className="border p-1 mx-1"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon}
                  </option>
                ))}
              </select>
            ))}
          </div> */}
          <div>
            <span className="mr-2">Lane Icons (Right):</span>
            {config[direction].lanesRight.map((lane, index) => (
              <Select
                key={`right-${index}`}
                value={lane.icon || ""}
                onChange={(e) =>
                  handleIconChange(direction, "lanesRight", index, e)
                }
                className="border p-1 mx-1 w-10 !min-w-0"
              >
                {iconOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    className="text-xl text-red-800 w-10 !min-w-0"
                  >
                    <span>{option.icon}</span>
                  </Option>
                ))}
              </Select>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default ConfigPanel;
