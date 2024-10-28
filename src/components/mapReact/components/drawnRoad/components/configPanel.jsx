import { iconOptions } from "../utils";
import Select from "react-select";
import PropTypes from "prop-types";
import Slider from "react-smooth-range-input";
import CustomSelect from "../../../../customSelect";

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
    <div className="absolute max-w-[20vw] no-scrollbar max-h-screen overflow-scroll top-0 left-0 p-6 border shadow-lg z-50 h-full  rounded-lg space-y-6">
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
          className="p-4  rounded-lg border border-gray-200 mb-4 w-full"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="capitalize font-medium text-gray-700">
              {direction} Direction
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor={"check" + direction} className="text-sm">
                Visible
              </label>
              <input
                id={"check" + direction}
                type="checkbox"
                checked={config[direction].visible}
                onChange={(e) =>
                  handleRoadChange(direction, "visible", e.target.checked)
                }
                className="accent-blue-500 "
              />
            </div>
          </div>

          {/* Lane Count Controls */}
          <div className="flex flex-col mb-3 gap-2 w-full">
            <label htmlFor={`lanesLeft-${direction}`} className="text-sm">
              Lanes Left:{" "}
              <span className="font-semibold">
                {config[direction].lanesLeft.length}
              </span>
            </label>
            <Slider
              id={`lanesLeft-${direction}`}
              min={1}
              max={5}
              hasTickMarks={false}
              barHeight={10}
              shouldAnimateNumber={false}
              step={1}
              value={config[direction].lanesLeft.length}
              onChange={(value) =>
                updateLaneCount(direction, "lanesLeft", value)
              }
              className="w-full"
            />
          </div>

          <div className="flex flex-col mb-3 gap-2 w-full">
            <label htmlFor={`lanesRight-${direction}`} className="text-sm">
              Lanes Right:{" "}
              <span className="font-semibold">
                {config[direction].lanesRight.length}
              </span>
            </label>
            <Slider
              id={`lanesRight-${direction}`}
              min={1}
              max={5}
              step={1}
              hasTickMarks={false}
              barHeight={10}
              shouldAnimateNumber={false}
              value={config[direction].lanesRight.length}
              onChange={(value) =>
                updateLaneCount(direction, "lanesRight", value)
              }
              className="w-full"
            />
          </div>

          {/* Lane Icon Controls */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm">Lane Icons (Right):</label>
            <div className="flex flex-wrap gap-1">
              {config[direction].lanesRight.map((lane, index) => (
                <div key={`${direction}-right-${index}`} className="w-1/4">
                  <CustomSelect
                    value={iconOptions.find(
                      (option) => option.value === lane.icon
                    )}
                    onChange={(e) =>
                      handleIconChange(direction, "lanesRight", index, e.value)
                    }
                    getOptionLabel={(option) => <>{option.icon}</>}
                    options={iconOptions}
                  />
                </div>
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

ConfigPanel.propTypes = {
  config: PropTypes.shape({
    angle: PropTypes.number,
    north: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
        })
      ),
    }),
    south: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
        })
      ),
    }),
    east: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
        })
      ),
    }),
    west: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default ConfigPanel;
