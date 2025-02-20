import { FaCompress, FaExpand } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import maplibregl from "maplibre-gl";

const FullscreenControl = ({ map }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!map) return;

    const control = new maplibregl.FullscreenControl();

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    map.addControl(control, "top-right");

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      map.removeControl(control);
    };
  }, [map]);

  return (
    <button
      className="p-2 text-white/80 hover:text-blue-400 hover:bg-white/10 rounded-xl transition-all duration-300"
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <FaCompress className="text-lg" />
      ) : (
        <FaExpand className="text-lg" />
      )}
    </button>
  );
};

export default FullscreenControl;
