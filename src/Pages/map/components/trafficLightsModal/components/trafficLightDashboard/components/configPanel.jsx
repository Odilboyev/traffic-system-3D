import PropTypes from "prop-types";
import Slider from "react-smooth-range-input";
import CustomSelect from "../../../../../../../components/customSelect";
import { iconOptions } from "../utils";

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

  // Add handler for channel ID updates
  const handleChannelIdChange = (direction, side, laneIndex, value) => {
    setConfig((prevConfig) => {
      const updatedLanes = [...prevConfig[direction][side]];
      updatedLanes[laneIndex] = {
        ...updatedLanes[laneIndex],
        chanel_id: parseInt(value),
      };
      return {
        ...prevConfig,
        [direction]: {
          ...prevConfig[direction],
          [side]: updatedLanes,
        },
      };
    });
  };

  // Add handler for crosswalk channel ID updates
  const handleCrosswalkChannelChange = (direction, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        cross_walk: { chanel_id: parseInt(value) },
      },
    }));
  };

  return (
    <div className=" no-scrollbar max-h-screen overflow-y-scroll p-6 border shadow-lg z-50 h-full rounded-lg space-y-6">
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
          className="p-4  rounded-lg border border-gray-200 mb-4 w-full max-w-full"
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
          <div className="flex flex-col mb-3 gap-2 max-w-full">
            <label
              htmlFor={`lanesLeft-${direction}`}
              className="text-sm font-bold text-gray-800 uppercase tracking-wide"
            >
              Lanes Left:{" "}
              <span className="font-semibold text-blue-600">
                {config[direction].lanesLeft.length}
              </span>
            </label>
            <Slider
              id={`lanesLeft-${direction}`}
              min={1}
              max={5}
              hasTickMarks={false}
              barHeight={10}
              style={{ maxWidth: "10vw" }}
              className="max-w-full"
              shouldAnimateNumber={false}
              step={1}
              value={config[direction].lanesLeft.length}
              onChange={(value) =>
                updateLaneCount(direction, "lanesLeft", value)
              }
            />
          </div>

          <div className="flex flex-col mb-3 gap-2 ">
            <label
              htmlFor={`lanesRight-${direction}`}
              className="text-sm font-bold text-gray-800 uppercase tracking-wide"
            >
              Lanes Right:{" "}
              <span className="font-semibold text-blue-600">
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
            />
          </div>

          {/* Lane Icon Controls with Channel ID */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Lane Icons (Right):
            </label>
            <div className="flex flex-wrap gap-1">
              {config[direction].lanesRight.map((lane, index) => (
                <div
                  key={`${direction}-right-${index}`}
                  className="w-full mb-2"
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-1/2">
                      <CustomSelect
                        value={iconOptions.find(
                          (option) => option.value === lane.icon
                        )}
                        onChange={(e) =>
                          handleIconChange(
                            direction,
                            "lanesRight",
                            index,
                            e.value
                          )
                        }
                        getOptionLabel={(option) => <>{option.icon}</>}
                        options={iconOptions}
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        type="number"
                        value={lane.chanel_id || ""}
                        onChange={(e) =>
                          handleChannelIdChange(
                            direction,
                            "lanesRight",
                            index,
                            e.target.value
                          )
                        }
                        onWheel={(e) => e.target.blur()}
                        placeholder="Channel ID"
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crosswalk Channel ID */}
          <div className="mt-4">
            <label className="text-sm font-bold text-gray-800 uppercase tracking-wide block mb-2">
              Crosswalk Channel ID:
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={config[direction].cross_walk?.chanel_id || ""}
              onChange={(e) =>
                handleCrosswalkChannelChange(direction, e.target.value)
              }
              placeholder="Crosswalk Channel ID"
              className="w-full px-3 py-2 border rounded"
            />
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
          chanel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        chanel_id: PropTypes.number,
      }),
    }),
    south: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          chanel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        chanel_id: PropTypes.number,
      }),
    }),
    east: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          chanel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        chanel_id: PropTypes.number,
      }),
    }),
    west: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          chanel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        chanel_id: PropTypes.number,
      }),
    }),
  }).isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default ConfigPanel;