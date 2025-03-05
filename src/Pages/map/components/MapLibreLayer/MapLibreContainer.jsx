import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

import { useEffect, useRef, useState } from "react";

import FuelStationMarkers from "../fuelStationMarkers";
import MapControls from "./MapControls";
// import ClusterLayer from "./ClusterLayer";
import PulsingMarkers from "../PulsingMarkers/PulsingMarkers";
import Supercluster from "supercluster";
import TrafficLightContainer from "../trafficLightMarkers/managementLights";
import WeatherMarkers from "../weatherMarkers/WeatherMarkers";
import { darkLayer } from "./utils/darkLayer";
import { getMarkerData } from "../../../../api/api.handlers";
import { lightLayer } from "./utils/lightLayer";
import maplibregl from "maplibre-gl";
import { useMapContext } from "../../context/MapContext";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useModule } from "../../context/ModuleContext";
import useModuleMarkers from "../../hooks/useModuleMarkers";
import { useTheme } from "../../../../customHooks/useTheme";
import { useZoomPanel } from "../../context/ZoomPanelContext";

const MapLibreContainer = () => {
  const mapContainer = useRef(null);
  const { map: contextMap, setMap: setContextMap } = useMapContext();
  const [map, setMap] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(14);
  const overlayRef = useRef(null);

  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers: updateMarkerData,
    useClusteredMarkers,
  } = useMapMarkers();

  const { activeModule } = useModule();
  const { updateModuleMarkers, activeModuleType } = useModuleMarkers();

  const { theme } = useTheme();
  const conditionMet = useZoomPanel();

  useEffect(() => {
    if (map) return;

    const savedMapState = JSON.parse(localStorage.getItem("mapState")) || {
      center: [69.254643, 41.321151],
      zoom: 14,
    };

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: theme === "dark" ? darkLayer : lightLayer,
      zoom: savedMapState.zoom,
      center: savedMapState.center,
      pitch: 40,
      maxPitch: 70,
      maxZoom: 20,
      minZoom: 5,
      // ...existing code...
      canvasContextAttributes: { antialias: true },
    });

    newMap.on("load", () => {
      console.log("Map loaded");
      setMap(newMap);
      setContextMap(newMap);
    });

    newMap.on("moveend", () => {
      const center = newMap.getCenter();
      const zoom = newMap.getZoom();
      setCurrentZoom(zoom);
      const mapState = { center: [center.lng, center.lat], zoom };
      localStorage.setItem("mapState", JSON.stringify(mapState));
    });

    getDataHandler();

    return () => {
      newMap.remove();
      setMap(null);
      setContextMap(null);
    };
  }, [theme]);

  useEffect(() => {
    if (!map) return;
    map.setStyle(theme === "dark" ? darkLayer : lightLayer);
  }, [theme, map]);

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
      >
        {/* Render different markers based on active module */}
        {map && activeModuleType === "monitoring" && (
          <>
            {currentZoom == 20 && <TrafficLightContainer />}
            {markers && (
              <>
                {console.log("Passing markers to PulsingMarkers:", markers)}
                <PulsingMarkers map={map} markers={markers} />
              </>
            )}
          </>
        )}
        {map && activeModuleType === "fuel" && (
          <FuelStationMarkers map={map} markers={markers} />
        )}
        {map && activeModuleType === "weather" && (
          <WeatherMarkers map={map} markers={markers} />
        )}
        {/* {map && <MapControls map={map} />} */}
        {/* {map && <ThreeDModelLayer map={map} />} */}
      </div>

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
