import React, { useState } from "react";
import { FireIcon } from "@heroicons/react/24/solid";
import { Switch } from "@material-tailwind/react";

const HeatmapControl = ({ onToggle, t }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleToggle = () => {
    const newState = !showHeatmap;
    setShowHeatmap(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <FireIcon className="h-5 w-5 text-orange-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t ? t("Heatmap View") : "Heatmap View"}
        </span>
        <Switch 
          color="blue"
          checked={showHeatmap}
          onChange={handleToggle}
          label=""
        />
      </div>
    </div>
  );
};

export default HeatmapControl;
