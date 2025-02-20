import { FaMinus, FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const ZoomControl = ({ map }) => {
  const [currentZoom, setCurrentZoom] = useState(
    map ? Math.floor(map.getZoom()) : 0
  );

  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      setCurrentZoom(Math.floor(map.getZoom()));
    };

    map.on("zoomend", handleZoomEnd);
    handleZoomEnd(); // Initial zoom level

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  const handleZoomIn = () => {
    if (map) {
      map.zoomTo(map.getZoom() + 1, {
        duration: 500, // Animation duration in milliseconds
        easing: (t) => t * (2 - t), // Smooth easing function
      });
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomTo(map.getZoom() - 1, {
        duration: 500, // Animation duration in milliseconds
        easing: (t) => t * (2 - t), // Smooth easing function
      });
    }
  };

  return (
    <div className=" flex items-center gap-4 bg-blue-gray-900/70 px-4 py-2 rounded-full backdrop-blur-sm">
      <button
        onClick={handleZoomOut}
        className="p-2 text-white hover:text-blue-400 transition-colors"
      >
        <FaMinus />
      </button>
      <div className="text-white font-medium min-w-[2rem] text-center">
        {currentZoom}
      </div>
      <button
        onClick={handleZoomIn}
        className="p-2 text-white hover:text-blue-400 transition-colors"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default ZoomControl;
