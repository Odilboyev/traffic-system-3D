import "./styles.css";

import React, { useEffect, useRef, useState } from "react";

import Draggable from "react-draggable";
import FullscreenControl from "../../controls/FullscreenControl";
import NavigationControl from "../../controls/NavigationControl";
import PropTypes from "prop-types";
import ScaleControl from "../../controls/ScaleControl";
import ZoomControl from "../../controls/ZoomControl";

const MapControlsPanel = ({ map }) => {
  const [position, setPosition] = useState(
    JSON.parse(localStorage.getItem("mapControlPosition")) || { x: 0, y: 0 }
  );
  const [currentPitch, setCurrentPitch] = useState(0);
  const nodeRef = useRef(null);

  // Update states when map moves
  useEffect(() => {
    if (!map) return;

    const updateMapState = () => {
      setCurrentPitch(map.getPitch());
    };

    map.on("pitch", updateMapState);

    // Initial state
    updateMapState();

    return () => {
      map.off("pitch", updateMapState);
    };
  }, [map]);

  // Add keyboard shortcuts
  useEffect(() => {
    if (!map) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case "r":
          map.setBearing(0);
          break;
        case "ArrowLeft":
          if (e.altKey) map.setBearing(map.getBearing() - 15);
          break;
        case "ArrowRight":
          if (e.altKey) map.setBearing(map.getBearing() + 15);
          break;
        case "3":
          if (e.altKey) map.setPitch(map.getPitch() === 0 ? 45 : 0);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [map]);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        localStorage.setItem(
          "mapControlPosition",
          JSON.stringify({ x: data.x, y: data.y })
        );
      }}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        ref={nodeRef}
        className="absolute z-[9999999] top-4 right-4 bg-blue-gray-900/70 rounded-lg backdrop-blur-md shadow-lg border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
      >
        <div className="drag-handle flex items-center justify-between px-3 py-1.5 bg-blue-gray-800/50 cursor-move border-b border-white/10 group hover:bg-blue-gray-700/50 transition-colors">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
          </div>
          <div className="text-[10px] text-white/40 group-hover:text-white/60 select-none">
            Drag to move
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white/60"></div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center gap-2">
            {/* <ScaleControl map={map} /> */}

            <ZoomControl map={map} />
            <div className="h-6 w-px bg-gray-100/30"></div>
            <NavigationControl map={map} />
            <div className="h-6 w-px bg-gray-100/30"></div>
            <div className="flex flex-col items-center gap-2 p-2">
              {/* <label className="text-white/70 text-xs">Tilt</label> */}
              <input
                type="range"
                min="0"
                max="60"
                value={currentPitch}
                onChange={(e) => map.setPitch(parseFloat(e.target.value))}
                className="map-range vertical max-w-full"
                title={`Tilt: ${Math.round(currentPitch)}°`}
              />
            </div>
            <div className="h-6 w-px bg-gray-100/30"></div>
            <FullscreenControl map={map} />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

MapControlsPanel.propTypes = {
  map: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    getBearing: PropTypes.func,
    setBearing: PropTypes.func,
    getPitch: PropTypes.func,
    setPitch: PropTypes.func,
  }),
};

export default MapControlsPanel;
