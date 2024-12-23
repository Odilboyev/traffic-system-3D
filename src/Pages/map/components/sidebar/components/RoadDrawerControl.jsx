import { FaPalette, FaRoad, FaTrash } from "react-icons/fa";
// file: /Users/webius/bg_soft/current_projects/traffic_system/app/src/Pages/map/components/sidebar/components/RoadDrawerControl.jsx
import React, { useState } from "react";

import { ChromePicker } from "react-color";

const RoadDrawerControl = ({ map, t }) => {
  const [roadWidth, setRoadWidth] = useState(5);
  const [roadColor, setRoadColor] = useState("#1E90FF");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleWidthChange = (e) => {
    const width = parseInt(e.target.value);
    setRoadWidth(width);
    map?.roadDrawer?.changeRoadWidth(width);
  };

  const handleColorChange = (color) => {
    setRoadColor(color.hex);
    map?.roadDrawer?.changeRoadColor(color.hex);
  };

  const handleClearRoads = () => {
    map?.roadDrawer?.clearAllRoads();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaRoad className="mr-2" /> Road Drawing Controls
      </h3>

      {/* Road Width Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Road Width: {roadWidth}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={roadWidth}
          onChange={handleWidthChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Color Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Road Color</label>
        <div className="flex items-center">
          <div
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-10 h-10 rounded-full cursor-pointer"
            style={{ backgroundColor: roadColor }}
          />
          {showColorPicker && (
            <div className="absolute z-10">
              <ChromePicker
                color={roadColor}
                onChange={handleColorChange}
                onChangeComplete={handleColorChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Clear Roads Button */}
      <button
        onClick={handleClearRoads}
        className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        <FaTrash className="mr-2" /> Clear All Roads
      </button>
    </div>
  );
};

export default RoadDrawerControl;
