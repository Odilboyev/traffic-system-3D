import React, { useEffect, useState } from "react";

import { FaLocationArrow } from "react-icons/fa";
import maplibregl from "maplibre-gl";

const GeolocateControl = ({ map }) => {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!map) return;

    const control = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });

    const handleTrackingChange = ({ target }) => {
      setIsTracking(target.isActive());
    };

    control.on("trackuserlocationstart", handleTrackingChange);
    control.on("trackuserlocationend", handleTrackingChange);
    map.addControl(control, "top-right");

    return () => {
      control.off("trackuserlocationstart", handleTrackingChange);
      control.off("trackuserlocationend", handleTrackingChange);
      map.removeControl(control);
    };
  }, [map]);

  return (
    <button
      className={`p-2 rounded-xl hover:bg-white/10 transition-all duration-300 ${isTracking ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`}
      title={isTracking ? 'Stop tracking location' : 'Track my location'}
    >
      <FaLocationArrow className="text-lg" />
    </button>
  );
};

export default GeolocateControl;
