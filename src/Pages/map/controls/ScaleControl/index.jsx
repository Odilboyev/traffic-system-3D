import React, { useEffect, useState } from "react";

const ScaleControl = ({ map }) => {
  const [scale, setScale] = useState("");

  useEffect(() => {
    if (!map) return;

    const updateScale = () => {
      const bounds = map.getBounds();
      const center = bounds.getCenter();

      // Get two points on the same latitude
      const point1 = [center.lng - 0.01, center.lat];
      const point2 = [center.lng + 0.01, center.lat];

      // Convert to pixels
      const p1 = map.project(point1);
      const p2 = map.project(point2);

      // Calculate distance in pixels
      const pixelDistance = Math.abs(p2.x - p1.x);

      // Calculate actual distance in meters
      // At the equator, 0.02 degrees is approximately 2.22 km
      const actualDistance = 2220 * Math.cos((center.lat * Math.PI) / 180);

      // Calculate meters per pixel
      const metersPerPixel = actualDistance / pixelDistance;

      // Calculate scale for 100 pixels
      const scaleDistance = metersPerPixel * 100;

      // Format the scale
      let formattedScale;
      if (scaleDistance >= 1000) {
        formattedScale = `${(scaleDistance / 1000).toFixed(1)} km`;
      } else {
        formattedScale = `${Math.round(scaleDistance)} m`;
      }

      setScale(formattedScale);
    };

    // Update scale on relevant map events
    map.on("zoomend", updateScale);
    map.on("moveend", updateScale);

    // Initial scale calculation
    updateScale();

    return () => {
      map.off("zoomend", updateScale);
      map.off("moveend", updateScale);
    };
  }, [map]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[100px] h-[2px] bg-white/30">
        <div className="absolute inset-0 bg-white/80" />
        <div className="absolute -bottom-1 left-0 w-[1px] h-[4px] bg-white/80" />
        <div className="absolute -bottom-1 right-0 w-[1px] h-[4px] bg-white/80" />
      </div>
      <span className="text-white/90 text-sm font-medium tracking-wide">{scale}</span>
    </div>
  );
};

export default ScaleControl;
