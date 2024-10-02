import { iconOptions } from "../utils";
import Select from "react-select";
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

  const getLaneIcons = (count, side) => {
    // right side
    const baseIcons = ["TbArrowBackUp"]; // Always include these icons
    const rightIcon = "TbArrowRampRight"; // Always the right icon
    const icons = [];

    // Push the base icons
    icons.push(...baseIcons);

    if (count > 1) {
      // Add the appropriate number of up icons based on the count
      for (let i = 0; i < count - 1; i++) {
        icons.push("TbArrowUp"); // Add up icons for the left lanes
      }

      // Add the right icon at the end
      icons.push(rightIcon);
      console.log(icons, "icons");
      return icons;
    }
    return ["TbArrowRampRight"];
  };

  const updateLaneCount = (direction, side, count) => {
    setConfig((prev) => {
      const existingLanes = config[direction][side] || [];
      const newLanes =
        side === "lanesLeft"
          ? Array.from({ length: count }, () => {
              return {};
            })
          : getLaneIcons(count, side).map((icon) => ({
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
    <div className="absolute max-w-[20vw] max-h-screen overflow-scroll top-0 left-0 p-6 border shadow-lg z-50 h-full bg-white rounded-lg space-y-6">
      {/* Angle Control */}
      <div className="flex items-center mb-6">
        <span className="text-sm font-medium mr-4">Rotation Angle:</span>
        <input
          type="range"
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
                  onChange={(e) => {
                    console.log(e.value);
                    handleIconChange(direction, "lanesRight", index, e.value);
                  }}
                  getOptionLabel={(option) => <>{option.icon}</>}
                  options={iconOptions}
                />
              ))}
            </div>

            {/* {config[direction].lanesRight.map((lane, index) => (
              <Select
                key={`right-${index}`}
                value={lane.icon || ""}
                onChange={(e) =>
                  handleIconChange(direction, "lanesRight", index, e)
                }
                className="border p-1 mx-1 w-12 !min-w-0 bg-white text-gray-700"
              >
                {iconOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    className="text-xl"
                  >
                    <>{option.icon}</>
                  </Option>
                ))}
              </Select>
            ))} */}
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
