import { ToastContainer, toast } from "react-toastify";

import CustomSelect from "../../../../../../../components/customSelect";
import { FaSpinner } from "react-icons/fa6";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { iconOptions } from "../utils";
import { modifySvetofor } from "../../../../../../../api/api.handlers";
import { t } from "i18next";
import { useState } from "react";

const ConfigPanel = ({ config, setConfig, id, handleCLose }) => {
  const [isLoading, setIsLoading] = useState(false);
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

  // Handle crosswalk existence changes
  const handleCrosswalkChange = (direction, side, value) => {
    console.log(direction, side, value, "handleCrosswalkChange");
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        [`cross_walk${side}`]: {
          ...prevConfig[direction][`cross_walk${side}`],
          exists: value
        }
      },
    }));
    console.log({
      ...config,
      [direction]: {
        ...config[direction],
        [`cross_walk${side}`]: {
          ...config[direction][`cross_walk${side}`],
          exists: value
        }
      },
    })
  };

  // Generates lane icons based on lane count for the right side
  const getLaneIcons = (count, currentIcons) => {
    const baseIcons = ["TbArrowBackUp"]; // Base icon(s) for lanes
    const rightIcon = "TbArrowRampRight"; // Right-most lane icon
    const icons = [...baseIcons];

    // Add upward icons based on lane count
    for (let i = 0; i < count - 1; i++) {
      icons.push("TbArrowUp");
    }
    icons.push(rightIcon);

    // Update current icons based on the new count
    const updatedIcons = currentIcons.slice(0, count).map((icon, index) => {
      // For existing icons, retain the channel_id
      if (icon.channel_id) {
        return icon;
      } else {
        // For new lanes, assign empty channel_id
        return {
          icon: icons[index] || icons[icons.length - 1], // default to the last icon if no new one is available
          channel_id: 100, // New lanes get an empty channel_id
        };
      }
    });

    // Add new lanes with empty channel_id if the count is greater than existing ones
    const newIcons = icons.slice(currentIcons.length, count).map((icon) => ({
      icon,
      channel_id: 100, // Empty channel_id for new lanes
    }));

    return [...updatedIcons, ...newIcons];
  };

  // Updates the lane count for the specified direction and side
  const updateLaneCount = (direction, side, count) => {
    // Ensure count is between 1 and 5
    const newCount = Math.max(1, Math.min(count, 5));

    setConfig((prev) => {
      // Get the existing lanes for the given side (either lanesLeft or lanesRight)
      const existingLanes = prev[direction]?.[side] || [];

      // Generate the new lanes based on the count
      const newLanes =
        side === "lanesLeft"
          ? Array(newCount).fill({}) // Create empty lanes for "lanesLeft"
          : getLaneIcons(newCount, existingLanes);

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

  const handleSubmit = async () => {
    const jsonOutput = JSON.stringify(config, null, 2);
    console.log(jsonOutput);
    try {
      setIsLoading(true);
      const res = await modifySvetofor(jsonOutput, id);

      // Assuming the response indicates success

      toast.success(t("saved_successfully!"), {
        position: "bottom-right",
        autoClose: 3000,
        containerId: "trafficlights",
      }); // Success notification

      console.log(res);
    } catch (error) {
      toast.error(t("error_occured"), {
        position: "bottom-right",
        autoClose: 3000,
        containerId: "trafficlights",
      }); // Error notification
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add handler for channel ID updates
  const handleChannelIdChange = (direction, side, laneIndex, value) => {
    setConfig((prevConfig) => {
      const updatedLanes = [...prevConfig[direction][side]];
      updatedLanes[laneIndex] = {
        ...updatedLanes[laneIndex],
        channel_id: parseInt(value),
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
  const handleCrosswalkChannelChange = (direction, side, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [direction]: {
        ...prevConfig[direction],
        [side]: { channel_id: parseInt(value) },
      },
    }));
  };

  return (
    <div className=" no-scrollbar relative max-h-[90vh] overflow-y-scroll p-6 border border-gray-100/20 shadow-lg z-50 h-full rounded-lg space-y-6">
      <ToastContainer
        position="bottom-right"
        containerId={"trafficlights"}
        autoClose={3000}
      />
      <button
        size="sm"
        onClick={handleCLose}
        className="absolute top-1 right-1 dark:text-white"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
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
          className="p-4  rounded-lg border border-gray-100/20 border border-gray-100/20-gray-200 mb-4 w-full max-w-full"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="capitalize font-medium ">
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
              className="text-sm font-bold  uppercase tracking-wide"
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
              step={1}
              style={{ maxWidth: "10vw" }}
              className="max-w-full"
              value={config[direction].lanesLeft.length}
              onChange={(value) =>
                updateLaneCount(direction, "lanesLeft", value)
              }
            />
          </div>

          <div className="flex flex-col mb-3 gap-2 ">
            <label
              htmlFor={`lanesRight-${direction}`}
              className="text-sm font-bold  uppercase tracking-wide"
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
              value={config[direction].lanesRight.length}
              onChange={(value) =>
                updateLaneCount(direction, "lanesRight", value)
              }
            />
          </div>

          {/* Crosswalk Existence Toggle */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{t("Crosswalks")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Left", "Right"].map((side) => (
                <div key={side} className="flex items-center justify-between">
                  <label className="capitalize">{t(side)}</label>
                  <input
                    type="checkbox"
                    checked={config[direction]?.[`cross_walk${side}`]?.exists ?? false}
                    onChange={(e) =>
                      handleCrosswalkChange(direction, side, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lane Icon Controls with Channel ID */}
          <div className="flex flex-col gap-3 mt-2">
            <label className="text-sm font-bold uppercase tracking-wide">
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
                        value={lane.channel_id || ""}
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
                        className="w-full px-2 py-1 border border-gray-100/20 rounded dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crosswalk Channel ID */}
          <div className="mt-4">
            <label className="text-sm font-bold uppercase tracking-wide block mb-2">
              {t("crosswalkLeftChannelId")}:
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={config[direction].cross_walkLeft?.channel_id || ""}
              onChange={(e) =>
                handleCrosswalkChannelChange(
                  direction,
                  "cross_walkLeft",
                  e.target.value
                )
              }
              placeholder="Crosswalk Channel ID"
              className="w-full px-2 py-1 border border-gray-100/20 rounded dark:bg-gray-800"
            />
          </div>
          {/* Crosswalk Channel ID */}
          <div className="mt-4">
            <label className="text-sm font-bold uppercase tracking-wide block mb-2">
              {t("crosswalkRightChannelId")}:
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={config[direction].cross_walkRight?.channel_id || ""}
              onChange={(e) =>
                handleCrosswalkChannelChange(
                  direction,
                  "cross_walkRight",
                  e.target.value
                )
              }
              placeholder="Crosswalk Channel ID"
              className="w-full px-2 py-1 border border-gray-100/20 rounded dark:bg-gray-800"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-200"
      >
        {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : t("save")}
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
          channel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        channel_id: PropTypes.number,
      }),
    }),
    south: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          channel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        channel_id: PropTypes.number,
      }),
    }),
    east: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          channel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        channel_id: PropTypes.number,
      }),
    }),
    west: PropTypes.shape({
      visible: PropTypes.bool,
      lanesLeft: PropTypes.arrayOf(PropTypes.object),
      lanesRight: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          channel_id: PropTypes.number,
        })
      ),
      cross_walk: PropTypes.shape({
        channel_id: PropTypes.number,
      }),
    }),
  }).isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default ConfigPanel;
