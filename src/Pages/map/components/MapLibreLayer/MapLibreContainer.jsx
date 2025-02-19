import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

import { useEffect, useRef, useState } from "react";

// import ClusterLayer from "./ClusterLayer";
import PulsingMarkers from "../PulsingMarkers/PulsingMarkers";
import Supercluster from "supercluster";
import TrafficLightContainer from "../trafficLightMarkers/managementLights";
import { darkLayer } from "./utils/darkLayer";
import { lightLayer } from "./utils/lightLayer";
import maplibregl from "maplibre-gl";
import { useMapContext } from "../../context/MapContext";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useTheme } from "../../../../customHooks/useTheme";

const MapLibreContainer = () => {
  const mapContainer = useRef(null);
  const { map: contextMap, setMap: setContextMap } = useMapContext();
  const [map, setMap] = useState(null);
  const supercluster = useRef(new Supercluster({ radius: 100, maxZoom: 16 }));

  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers: updateMarkerData,
    useClusteredMarkers,
  } = useMapMarkers();

  const { theme } = useTheme();

  useEffect(() => {
    if (map) return;

    console.log("Initializing MapLibre map with theme:", theme);
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
      const mapState = { center: [center.lng, center.lat], zoom };
      localStorage.setItem("mapState", JSON.stringify(mapState));
    });

    newMap.addControl(new maplibregl.NavigationControl(), "top-right");
    newMap.addControl(new maplibregl.FullscreenControl(), "top-right");
    newMap.addControl(new maplibregl.ScaleControl(), "bottom-left");
    newMap.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

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

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{ background: theme === "dark" ? "#45516E" : "#ffffff" }}
    >
      {map && <TrafficLightContainer />}
      {map && markers && <PulsingMarkers map={map} markers={markers} />}
      {/* {map && (
        <ClusterLayer
          map={map}
          markers={markers}
          superclusterRef={supercluster}
        />
      )} */}
      {/* {map && <ThreeDModelLayer map={map} />} */}
      <div style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
};

export default MapLibreContainer;
