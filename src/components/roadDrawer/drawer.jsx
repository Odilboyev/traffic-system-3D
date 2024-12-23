import React, { useCallback, useEffect, useState } from "react";

import L from "leaflet";
import { useMap } from "react-leaflet";

const RoadDrawer = () => {
  const map = useMap();
  const [drawingLayer, setDrawingLayer] = useState(null);
  const [currentPolyline, setCurrentPolyline] = useState(null);
  const [roads, setRoads] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [roadWidth, setRoadWidth] = useState(5); // Default road width
  const [roadColor, setRoadColor] = useState("blue"); // Default road color

  useEffect(() => {
    if (!map) return;

    // Create a layer group specifically for road drawing
    const layer = L.layerGroup().addTo(map);
    setDrawingLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !drawingLayer) return;

    const handleMapClick = (e) => {
      if (!isDrawing) return;

      const { lat, lng } = e.latlng;

      if (!currentPolyline) {
        // Create a new polyline with explicit latlngs array
        const newPolyline = L.polyline([[lat, lng]], {
          color: roadColor,
          weight: roadWidth,
          opacity: 0.7,
        });

        // Add the polyline to the layer group
        drawingLayer.addLayer(newPolyline);
        setCurrentPolyline(newPolyline);
      } else {
        // Add point to existing polyline
        currentPolyline.addLatLng([lat, lng]);
      }
    };

    const handleRightClick = () => {
      if (currentPolyline) {
        // Get coordinates and save
        const roadCoords = currentPolyline.getLatLngs();
        saveRoad(roadCoords);

        // Remove the polyline from the layer
        drawingLayer.removeLayer(currentPolyline);

        // Reset states
        setCurrentPolyline(null);
        setIsDrawing(false);
      }
    };

    if (isDrawing) {
      map.on("click", handleMapClick);
      map.on("contextmenu", handleRightClick);
    } else {
      map.off("click", handleMapClick);
      map.off("contextmenu", handleRightClick);
    }

    return () => {
      map.off("click", handleMapClick);
      map.off("contextmenu", handleRightClick);
    };
  }, [isDrawing, currentPolyline, drawingLayer, map, roadWidth, roadColor]);

  // Expose method to start/stop drawing
  useEffect(() => {
    const startDrawing = () => setIsDrawing(true);
    const stopDrawing = () => {
      setIsDrawing(false);

      // Clear any incomplete polylines
      if (currentPolyline) {
        drawingLayer.removeLayer(currentPolyline);
        setCurrentPolyline(null);
      }
    };

    map.on("roadDrawer:start", startDrawing);
    map.on("roadDrawer:stop", stopDrawing);

    return () => {
      map.off("roadDrawer:start", startDrawing);
      map.off("roadDrawer:stop", stopDrawing);
    };
  }, [map, drawingLayer, currentPolyline]);

  // Function to save road
  const saveRoad = useCallback(
    (roadCoords) => {
      const roadData = {
        id: Date.now(), // Unique identifier
        coordinates: roadCoords.map((coord) => ({
          lat: coord.lat,
          lng: coord.lng,
        })),
        width: roadWidth,
        color: roadColor,
        createdAt: new Date().toISOString(),
      };

      setRoads((prevRoads) => [...prevRoads, roadData]);

      // Optional: You can add additional logic here, such as sending to a backend
      console.log("Road saved:", roadData);
    },
    [roadWidth, roadColor]
  );

  // Function to change road width
  const changeRoadWidth = useCallback(
    (width) => {
      setRoadWidth(width);

      // If there's a current polyline, update its width
      if (currentPolyline) {
        currentPolyline.setStyle({ weight: width });
      }
    },
    [currentPolyline]
  );

  // Function to change road color
  const changeRoadColor = useCallback(
    (color) => {
      setRoadColor(color);

      // If there's a current polyline, update its color
      if (currentPolyline) {
        currentPolyline.setStyle({ color: color });
      }
    },
    [currentPolyline]
  );

  // Expose methods to map for external control
  useEffect(() => {
    map.roadDrawer = {
      saveRoad,
      changeRoadWidth,
      changeRoadColor,
      getRoads: () => roads,
    };

    return () => {
      delete map.roadDrawer;
    };
  }, [map, saveRoad, changeRoadWidth, changeRoadColor, roads]);

  return null;
};

export default RoadDrawer;
