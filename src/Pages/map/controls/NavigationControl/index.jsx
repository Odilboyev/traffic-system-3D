import "./styles.css";

import { FaArrowDown, FaArrowUp, FaCompass } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

const NavigationControl = ({ map }) => {
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateRotation = () => {
      setBearing(Math.round(map.getBearing()));
    };

    map.on("rotate", updateRotation);

    // Initial values
    updateRotation();

    return () => {
      map.off("rotate", updateRotation);
    };
  }, [map]);

  const handleMouseDown = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate initial angle
    const initialAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialBearing = map.getBearing();

    const updateAngle = (moveEvent) => {
      const currentAngle =
        Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) *
        (180 / Math.PI);
      const deltaAngle = currentAngle - initialAngle;
      const newBearing = initialBearing + deltaAngle;
      setBearing(newBearing);
      map.setBearing(newBearing);
    };

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      updateAngle(moveEvent);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.classList.remove("grabbing");
    };

    e.currentTarget.classList.add("grabbing");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetNorth = () => {
    if (!map) return;
    map.easeTo({
      bearing: 0,
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
    <div className="nav-container">
      <div
        className="nav-ring"
        onMouseDown={handleMouseDown}
        title="Drag to rotate map"
        style={{ transform: `rotate(${bearing}deg)` }}
      />
      <button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white hover:text-blue-500 border-none hover:border-none rounded-full p-2 group"
        onClick={resetNorth}
        title="Click to reset rotation"
      >
        <FaCompass
          className="w-5 h-5"
          style={{ transform: `rotate(${bearing - 45}deg)` }}
        />{" "}
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold bg-white/20 backdrop-blur-md rounded-full px-1">
          {Math.abs(Math.round(bearing))}°
        </span>
      </button>
    </div>
  );
};

NavigationControl.propTypes = {
  map: PropTypes.shape({
    getBearing: PropTypes.func,
    setPitch: PropTypes.func,
    getPitch: PropTypes.func,
    setBearing: PropTypes.func,
    easeTo: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }),
};

export default NavigationControl;
