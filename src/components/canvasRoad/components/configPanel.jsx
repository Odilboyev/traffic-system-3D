import React from "react";

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

  const handleSubmit = () => {
    const jsonOutput = JSON.stringify(config, null, 2);
    console.log("Crossroad Configuration:", jsonOutput);
    // You can further process the jsonOutput, like sending it to an API
  };
  return (
    <div className="absolute top-0 left-0 p-4 bg-white shadow-md z-50">
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
              config[direction].lanesTo === 0 ? "" : config[direction].lanesTo
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
  );
};

export default ConfigPanel;
