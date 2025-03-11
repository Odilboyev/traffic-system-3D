import { useCallback, useEffect, useState } from "react";

import { useMapMarkers } from "./useMapMarkers";
import { useModuleContext } from "../context/ModuleContext";

const weatherMarkers = [
  {
    id: 201,
    lat: 41.311081,
    lng: 69.240562,
    type: "weather_station",
    name: "Toshkent Markaz",
    temperature: 32,
    condition: "sunny",
  },
  {
    id: 202,
    lat: 41.32589,
    lng: 69.228909,
    type: "weather_station",
    name: "Yunusobod",
    temperature: 30,
    condition: "cloudy",
  },
  {
    id: 203,
    lat: 41.292493,
    lng: 69.25453,
    type: "weather_station",
    name: "Chilonzor",
    temperature: 31,
    condition: "sunny",
  },
  {
    id: 204,
    lat: 41.338634,
    lng: 69.334765,
    type: "weather_alert",
    alertType: "strong_wind",
    severity: "moderate",
  },
  {
    id: 205,
    lat: 41.301256,
    lng: 69.267447,
    type: "weather_alert",
    alertType: "rain",
    severity: "low",
  },
];

const useModuleMarkers = () => {
  const { markers, setMarkers, clearMarkers } = useMapMarkers();
  const [activeModuleType, setActiveModuleType] = useState("its");
  const { activeModule } = useModuleContext();

  // Function to load markers based on module type
  const loadMarkersByModuleType = useCallback(
    (moduleType) => {
      let markersToLoad = [];

      switch (moduleType) {
        case "its":
          markersToLoad = markers.filter(
            (marker) =>
              marker.type === 2 || marker.type === 3 || marker.type === 4
          );
          console.log("Loading traffic markers:", markersToLoad);
          break;
        case "fuel":
          markersToLoad = markers;
          break;
        case "weather":
          markersToLoad = weatherMarkers.map((marker) => ({
            id: marker.id,
            lat: marker.lat,
            lng: marker.lng,
            type: marker.type === "weather_station" ? 6 : 7, // Weather station or alert
            name: marker.name || "",
            temperature: marker.temperature || 0,
            condition: marker.condition || "",
            alertType: marker.alertType || "",
            severity: marker.severity || "",
          }));
          break;
        default:
          markersToLoad = [];
      }

      setMarkers(markersToLoad);
    },
    [setMarkers]
  );

  // Update markers when module type changes
  const updateModuleMarkers = useCallback(
    (module) => {
      if (!module) return;

      const moduleType = module.id || "its";
      setActiveModuleType(moduleType);

      // Clear existing markers for any module change
      clearMarkers();

      if (moduleType === "its") {
        // For monitoring module, we need to fetch the data again
        // This will trigger the API call in MapLibreContainer
        console.log("Switching to monitoring module, markers cleared");
      } else {
        // Load new markers for other modules
        loadMarkersByModuleType(moduleType);
      }
    },
    [clearMarkers, loadMarkersByModuleType]
  );

  // Automatically update markers when active module changes
  useEffect(() => {
    if (activeModule) {
      updateModuleMarkers(activeModule);
    }
  }, [activeModule, updateModuleMarkers]);

  return {
    updateModuleMarkers,
    activeModuleType,
  };
};

export default useModuleMarkers;
