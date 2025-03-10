import { useEffect, useRef } from "react";

import { useFuelStations } from "../../hooks/useFuelStations";

const FuelStationHeatmap = ({ map }) => {
  const sourceAdded = useRef(false);
  const { stations, getFilteredStations } = useFuelStations();

  useEffect(() => {
    if (!map) return;

    try {
      // Safely handle case when stations is undefined or not an array
      if (!Array.isArray(stations) || stations.length === 0) {
        console.warn("No stations data available for heatmap");
        return;
      }

      // Get filtered stations based on user preferences
      const filteredStations = getFilteredStations();

      if (!Array.isArray(filteredStations)) {
        console.warn("Filtered stations is not an array");
        return;
      }

      // Filter valid stations with proper coordinates
      const validStations = filteredStations.filter((station) => {
        return (
          station &&
          typeof station === "object" &&
          typeof station.lat === "number" &&
          typeof station.lng === "number" &&
          station.lng >= -180 &&
          station.lng <= 180 &&
          station.lat >= -90 &&
          station.lat <= 90
        );
      });

      if (validStations.length === 0) {
        console.warn("No valid stations with coordinates for heatmap");
        return;
      }

      // Remove existing heatmap layers and source if they exist
      if (sourceAdded.current) {
        if (map.getLayer("fuel-stations-heat"))
          map.removeLayer("fuel-stations-heat");
        if (map.getSource("fuel-stations-heatmap"))
          map.removeSource("fuel-stations-heatmap");
      }

      // Add the GeoJSON source for heatmap
      map.addSource("fuel-stations-heatmap", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: validStations.map((station) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [station.lng, station.lat],
            },
            properties: {
              id: station.id,
              type: station.type || "petrol",
            },
          })),
        },
      });

      // Check if the source was successfully added before adding the layer
      if (!map.getSource("fuel-stations-heatmap")) {
        console.warn("Failed to add heatmap source to map");
        return;
      }

      // Add heatmap layer
      map.addLayer({
        id: "fuel-stations-heat",
        type: "heatmap",
        source: "fuel-stations-heatmap",
        maxzoom: 15,
        paint: {
          // Increase weight based on station type (can be customized)
          "heatmap-weight": [
            "match",
            ["get", "type"],
            "petrol",
            0.8,
            "gas",
            0.7,
            "electro",
            0.6,
            0.5, // default
          ],
          // Increase intensity as zoom level increases
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            0.1,
            15,
            1.5,
          ],
          // Color heatmap based on density
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust radius based on zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 8, 8, 15, 25],
          // Decrease opacity as zoom increases to transition to individual points
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 8, 1, 15, 0],
        },
      });

      // Mark as successfully added
      sourceAdded.current = true;
      console.log("Heatmap layer added successfully");
    } catch (error) {
      console.error("Error setting up heatmap:", error);
      return;
    }

    return () => {
      // Clean up when component unmounts
      try {
        if (map) {
          if (map.getLayer("fuel-stations-heat"))
            map.removeLayer("fuel-stations-heat");
          if (map.getSource("fuel-stations-heatmap"))
            map.removeSource("fuel-stations-heatmap");
          sourceAdded.current = false;
        }
      } catch (error) {
        console.error("Error cleaning up heatmap:", error);
      }
    };
  }, [map, stations, getFilteredStations]);

  return null;
};

export default FuelStationHeatmap;
