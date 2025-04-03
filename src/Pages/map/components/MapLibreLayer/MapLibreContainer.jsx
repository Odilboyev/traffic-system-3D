import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

import { useEffect, useRef, useState } from "react";

import ActiveModuleComponents from "../ActiveModuleComponents";
import { darkLayer } from "./utils/darkLayer";
import { lightLayer } from "./utils/lightLayer";
import maplibregl from "maplibre-gl";
import { useFuelStations } from "../../hooks/useFuelStations";
import { useMapContext } from "../../context/MapContext";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useModuleContext } from "../../context/ModuleContext";
import useModuleMarkers from "../../hooks/useModuleMarkers";
import { useTheme } from "../../../../customHooks/useTheme";
import { useZoomPanel } from "../../context/ZoomPanelContext";

const MapLibreContainer = () => {
  const mapContainer = useRef(null);
  const { map: contextMap, setMap: setContextMap } = useMapContext();
  const [map, setMap] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(14);
  const overlayRef = useRef(null);
  const { showHeatmap, setShowHeatmap } = useFuelStations();

  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers: updateMarkerData,
    useClusteredMarkers,
  } = useMapMarkers();

  const { activeModule } = useModuleContext();
  const { updateModuleMarkers, activeModuleType } = useModuleMarkers();

  const { theme } = useTheme();
  const conditionMet = useZoomPanel();

  useEffect(() => {
    if (map) return;

    // Safely parse mapState from localStorage with fallback
    let savedMapState = {
      center: [69.254643, 41.321151],
      zoom: 14,
      pitch: 0,
      bearing: 0
    };

    try {
      const storedMapState = localStorage.getItem("mapState");
      if (storedMapState && storedMapState !== undefined) {
        const parsedState = JSON.parse(storedMapState);
        // Validate the parsed state
        if (
          parsedState &&
          Array.isArray(parsedState.center) &&
          parsedState.center.length === 2 &&
          typeof parsedState.zoom === "number" &&
          typeof parsedState.pitch === "number" &&
          typeof parsedState.bearing === "number"
        ) {
          savedMapState = parsedState;
        }
      }
    } catch (error) {
      console.warn("Error parsing mapState from localStorage:", error);
      localStorage.removeItem("mapState");
    }

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: theme === "dark" ? darkLayer : lightLayer,
      zoom: savedMapState.zoom,
      center: savedMapState.center,
      pitch: savedMapState.pitch,
      bearing: savedMapState.bearing,
      maxPitch: 70,
      maxZoom: 20,
      minZoom: 0,
      canvasContextAttributes: { antialias: true },
      projection: { name: "mercator" },
      preserveDrawingBuffer: true,
    });

    // Set up map event listeners
    newMap.on("load", () => {
      console.log("Map loaded");
      setMap(newMap);
      setContextMap(newMap);
      getDataHandler(); // Call this after map is loaded
    });

    newMap.on("moveend", () => {
      const center = newMap.getCenter();
      const zoom = newMap.getZoom();
      const pitch = newMap.getPitch();
      const bearing = newMap.getBearing();
      setCurrentZoom(zoom);
      try {
        const mapState = { 
          center: [center.lng, center.lat], 
          zoom,
          pitch,
          bearing
        };
        localStorage.setItem("mapState", JSON.stringify(mapState));
      } catch (error) {
        console.warn("Error saving mapState to localStorage:", error);
      }
    });

    // Cleanup function
    return () => {
      newMap.remove();
      setMap(null);
      setContextMap(null);
    };
  }, [theme]);

  useEffect(() => {
    if (!map) return;

    // Store current map state
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();
    const currentPitch = map.getPitch();
    const currentBearing = map.getBearing();

    // Listen for style load completion
    const styleLoadListener = () => {
      map.setZoom(currentZoom);
      map.setCenter(currentCenter);
      map.setPitch(currentPitch);
      map.setBearing(currentBearing);
      map.off('styledata', styleLoadListener);
    };

    map.on('styledata', styleLoadListener);
    map.setStyle(theme === "dark" ? darkLayer : lightLayer, { diff: false });
  }, [theme, map]);

  // Fetch markers when activeModuleType changes to 'monitoring'
  useEffect(() => {
    if (!map || activeModuleType !== "its") return;

    console.log("Fetching monitoring markers due to module switch");
    getDataHandler();
  }, [map, activeModuleType, getDataHandler]);

  // Update markers when active module changes
  useEffect(() => {
    if (!activeModule) return;
    updateModuleMarkers(activeModule);
  }, [activeModule, updateModuleMarkers]);

  return (
    <div className="relative" style={{ width: "100vw", height: "100vh" }}>
      <div
        ref={mapContainer}
        className="map-container w-full h-full"
        style={{ background: theme === "dark" ? "#45516E" : "#ffffff" }}
      ></div>

      {/* Active Module Components */}
      {map && (
        <>
          <ActiveModuleComponents map={map} currentZoom={currentZoom} />
        </>
      )}

      {/* Gradient Overlay */}
      {conditionMet && (
        <div ref={overlayRef} className="absolute inset-0 pointer-events-none">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-black/90 to-transparent" />
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-black/90 to-transparent" />
          {/* Left gradient */}
          <div className="absolute top-0 left-0 bottom-0 w-[30vw] bg-gradient-to-r from-black/90 to-transparent" />
          {/* Right gradient */}
          <div className="absolute top-0 right-0 bottom-0 w-[30vw] bg-gradient-to-l from-black/90 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default MapLibreContainer;
