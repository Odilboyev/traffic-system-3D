import React, { useRef, useState } from "react";

import Draggable from "react-draggable";
import FullscreenControl from "../../controls/FullscreenControl";
import NavigationControl from "../../controls/NavigationControl";
import ScaleControl from "../../controls/ScaleControl";
import ZoomControl from "../../controls/ZoomControl";

const MapControlsPanel = ({ map }) => {
  const [position, setPosition] = useState(
    JSON.parse(localStorage.getItem("mapControlPosition")) || { x: 0, y: 0 }
  );
  const nodeRef = useRef(null);

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
            <FullscreenControl map={map} />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MapControlsPanel;
