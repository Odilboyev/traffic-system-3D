import "./styles.css";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Control from "../../../../../components/customControl";
import { Md3dRotation } from "react-icons/md";
import { useMap } from "react-leaflet";

const MapOrientationControl = () => {
  const map = useMap();
  const rotationRingRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const [is3DActive, setIs3DActive] = useState(false);
  const [bearing, setBearing] = useState(0);

  const getMapLibreInstance = useCallback(() => {
    const maplibreLayer = Object.values(map._layers).find(
      (layer) => layer._glMap
    );
    return maplibreLayer?._glMap;
  }, [map]);

  const getEventPosition = useCallback((e) => {
    const touch = e.touches?.[0];
    return {
      clientX: touch ? touch.clientX : e.clientX,
      clientY: touch ? touch.clientY : e.clientY,
    };
  }, []);

  const calculateAngle = useCallback((rect, clientX, clientY) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }, []);

  const handleDragStart = useCallback(
    (e) => {
      e.preventDefault();
      if (!rotationRingRef.current) return;

      isDraggingRef.current = true;
      const rect = rotationRingRef.current.getBoundingClientRect();
      const { clientX, clientY } = getEventPosition(e);
      startAngleRef.current = calculateAngle(rect, clientX, clientY);

      const maplibreMap = getMapLibreInstance();
      if (maplibreMap) {
        startAngleRef.current -= maplibreMap.getBearing();
      }

      // Add event listeners to document for better drag handling
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("touchmove", handleDrag, { passive: false });
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchend", handleDragEnd);
    },
    [getMapLibreInstance, calculateAngle, getEventPosition]
  );

  const handleDrag = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDraggingRef.current || !rotationRingRef.current) return;

      const rect = rotationRingRef.current.getBoundingClientRect();
      const { clientX, clientY } = getEventPosition(e);
      const angle = calculateAngle(rect, clientX, clientY);

      const maplibreMap = getMapLibreInstance();
      if (maplibreMap) {
        let rotation = angle - startAngleRef.current;
        // Normalize rotation to -180 to 180 degrees
        rotation = ((rotation + 180) % 360) - 180;
        maplibreMap.setBearing(rotation);
        setBearing(-rotation);
      }
    },
    [getMapLibreInstance, calculateAngle, getEventPosition]
  );

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
  }, [handleDrag]);

  const toggle3D = useCallback(() => {
    const maplibreMap = getMapLibreInstance();
    if (maplibreMap) {
      const newPitch = maplibreMap.getPitch() === 0 ? 45 : 0;
      maplibreMap.setPitch(newPitch);
      setIs3DActive(newPitch !== 0);
    }
  }, [getMapLibreInstance]);

  useEffect(() => {
    // Update bearing when map rotates
    const maplibreMap = getMapLibreInstance();
    if (maplibreMap) {
      const onRotate = () => {
        setBearing(-maplibreMap.getBearing());
      };
      maplibreMap.on("rotate", onRotate);
      return () => {
        maplibreMap.off("rotate", onRotate);
      };
    }
  }, [getMapLibreInstance]);

  // Generate tick marks with major ticks at cardinal directions
  const tickMarks = Array.from({ length: 36 }, (_, i) => (
    <div
      key={i}
      className={`tick-mark ${i % 9 === 0 ? "major" : ""}`}
      style={{
        transform: `rotate(${i * 10}deg)`,
      }}
    />
  ));

  return (
    <Control position="topright">
      <div
        className="map-orientation-control"
        style={{ transform: `rotate(${bearing}deg)` }}
      >
        <div
          ref={rotationRingRef}
          className="rotation-ring"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />
        <div className="compass-marker">N</div>
        <div className="compass-directions">
          <div className="compass-direction east">E</div>
          <div className="compass-direction west">W</div>
          <div className="compass-direction south">S</div>
        </div>
        <div className="tick-marks">{tickMarks}</div>
        <button
          className={`toggle-3d-button ${is3DActive ? "active" : ""}`}
          onClick={toggle3D}
        >
          <Md3dRotation className="h-5 w-5" />
        </button>
      </div>
    </Control>
  );
};

export default MapOrientationControl;
