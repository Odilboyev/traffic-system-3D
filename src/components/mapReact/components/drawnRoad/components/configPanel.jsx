import { iconOptions } from "../utils";
import Select from "react-select";

const ConfigPanel = ({ config, setConfig }) => {
  // Handles changes in road configuration for visibility or other fields
  const handleRoadChange = (direction, field, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        [field]: value,
      },
    }));
  };

  // Generates lane icons based on lane count for the right side
  const getLaneIcons = (count) => {
    const baseIcons = ["TbArrowBackUp"]; // Base icon(s) for lanes
    const rightIcon = "TbArrowRampRight"; // Right-most lane icon
    const icons = [...baseIcons];

    // Add upward icons based on lane count
    for (let i = 0; i < count - 1; i++) {
      icons.push("TbArrowUp");
    }
    icons.push(rightIcon);
    return icons;
  };

  // Updates the lane count for the specified direction and side
  const updateLaneCount = (direction, side, count) => {
    // Ensure count is between 1 and 5
    const newCount = Math.max(1, Math.min(count, 5));

    setConfig((prev) => {
      const newLanes =
        side === "lanesLeft"
          ? Array(newCount).fill({}) // Create lanes for "lanesLeft"
          : getLaneIcons(newCount).map((icon) => ({ icon })); // Create lanes for "lanesRight"

      return {
        ...prev,
        [direction]: {
          ...prev[direction],
          [side]: newLanes,
        },
      };
    });
  };

  // Updates the icon for a specific lane
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
  };

  return (
    <div className="absolute max-w-[20vw] max-h-screen overflow-scroll top-0 left-0 p-6 border shadow-lg z-50 h-full bg-white rounded-lg space-y-6">
      {/* Angle Control */}
      <div className="flex items-center mb-6">
        <span className="text-sm font-medium mr-4">Rotation Angle:</span>
        <input
          type="range"
          id="rotation_angle"
          min={0}
          max={360}
          value={config.angle}
          onChange={(e) => handleAngleChange(+e.target.value)}
          className="w-full accent-blue-500"
        />
        <span className="ml-4 text-blue-600 font-semibold">
          {config.angle}°
        </span>
      </div>

      {["north", "south", "east", "west"].map((direction) => (
        <div
          key={direction}
          className="p-4 bg-gray-100 rounded-lg border border-gray-200 mb-4 w-full"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="capitalize font-medium text-gray-700">
              {direction} Direction
            </span>
            <div className="flex items-center">
              <input
                id={"check" + direction}
                type="checkbox"
                checked={config[direction].visible}
                onChange={(e) =>
                  handleRoadChange(direction, "visible", e.target.checked)
                }
                className="accent-blue-500"
              />
              <label htmlFor={"check" + direction} className="ml-2 text-sm">
                Visible
              </label>
            </div>
          </div>

          {/* Lane Count Controls */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">
              Lanes Left:{" "}
              <span className="font-semibold">
                {config[direction].lanesLeft.length}
              </span>
            </span>
            <input
              type="range"
              id="lanesLeft"
              min={1}
              max={5}
              step={1}
              value={config[direction].lanesLeft.length}
              onChange={(e) =>
                updateLaneCount(direction, "lanesLeft", +e.target.value)
              }
              className="w-2/3 accent-blue-gray-500"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">
              Lanes Right:{" "}
              <span className="font-semibold">
                {config[direction].lanesRight.length}
              </span>
            </span>
            <input
              type="range"
              id="lanesRight"
              min={1}
              max={5}
              step={1}
              value={config[direction].lanesRight.length}
              onChange={(e) =>
                updateLaneCount(direction, "lanesRight", +e.target.value)
              }
              className="w-2/3 accent-blue-gray-800"
            />
          </div>

          {/* Lane Icon Controls */}
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="text-sm">Lane Icons (Right):</span>
            <div className="flex flex-wrap">
              {config[direction].lanesRight.map((lane, index) => (
                <Select
                  key={index}
                  value={iconOptions.find(
                    (option) => option.value === lane.icon
                  )}
                  onChange={(e) =>
                    handleIconChange(direction, "lanesRight", index, e.value)
                  }
                  getOptionLabel={(option) => <>{option.icon}</>}
                  options={iconOptions}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default ConfigPanel;
