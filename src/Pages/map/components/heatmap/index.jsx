import { Polyline, useMap } from "react-leaflet";
import React, { useEffect, useState } from "react";

const HeatMap = ({
  coordinates = [
    { lat: 41.350781, lng: 69.352264 }, // Default crossroad coordinates
  ],
  intensity = [0.5, 0.7, 0.3, 0.6], // Sample intensity values
}) => {
  const map = useMap();
  const [polylines, setPolylines] = useState([]);

  useEffect(() => {
    // Generate heat map polylines based on coordinates and intensity
    const generatedPolylines = coordinates.map((coord, index) => {
      // Create nearby points to simulate heat spread
      const offset = 0.0001 * (index + 1);
      const points = [
        [coord.lat, coord.lng],
        [coord.lat + offset, coord.lng],
        [coord.lat, coord.lng + offset],
        [coord.lat - offset, coord.lng],
      ];

      // Color gradient based on intensity
      const color = getColorForIntensity(intensity[index] || 0.5);

      return {
        positions: points,
        color: color,
        weight: 5,
        opacity: 0.7,
      };
    });

    setPolylines(generatedPolylines);
  }, [coordinates, intensity]);

  // Helper function to generate color based on intensity
  const getColorForIntensity = (intensity) => {
    // Heat map color gradient: Green (low) -> Yellow (medium) -> Red (high)
    if (intensity < 0.3) return "green";
    if (intensity < 0.6) return "yellow";
    return "red";
  };

  return (
    <>
      {polylines.map((polyline, index) => (
        <Polyline
          key={index}
          positions={polyline.positions}
          color={polyline.color}
          weight={polyline.weight}
          opacity={polyline.opacity}
        />
      ))}
    </>
  );
};

export default HeatMap;
