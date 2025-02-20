import { FaArrowDown, FaArrowUp, FaCompass, FaUndo } from "react-icons/fa";
import React, { useEffect, useState } from "react";

const NavigationControl = ({ map }) => {
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateRotation = () => {
      setBearing(Math.round(map.getBearing()));
      setPitch(Math.round(map.getPitch()));
    };

    map.on("rotate", updateRotation);
    map.on("pitch", updateRotation);

    // Initial values
    updateRotation();

    return () => {
      map.off("rotate", updateRotation);
      map.off("pitch", updateRotation);
    };
  }, [map]);

  const resetNorth = () => {
    if (!map) return;
    map.easeTo({
      bearing: 0,
      pitch: 0,
      duration: 500,
    });
  };

  const adjustPitch = (delta) => {
    if (!map) return;
    const newPitch = Math.max(0, Math.min(70, map.getPitch() + delta));
    map.easeTo({
      pitch: newPitch,
      duration: 300,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={() => adjustPitch(10)}
          className="p-1.5 text-white/80 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all"
          title="Tilt up"
        >
          <FaArrowUp className="text-sm" />
        </button>
        <button
          onClick={() => adjustPitch(-10)}
          className="p-1.5 text-white/80 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all"
          title="Tilt down"
        >
          <FaArrowDown className="text-sm" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetNorth}
          className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-300 ${
            bearing !== 0 || pitch !== 0
              ? "text-blue-400"
              : "text-white/80 hover:text-blue-400"
          }`}
          title="Reset bearing and pitch"
          style={{
            transform: `rotate(${-bearing - 45}deg)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <FaCompass className="text-xl" />
        </button>
        <span className="text-white/80 text-xs font-medium tabular-nums tracking-wide min-w-[2rem] text-center">
          {Math.abs(bearing)}°
        </span>
      </div>
    </div>
  );
};

export default NavigationControl;
