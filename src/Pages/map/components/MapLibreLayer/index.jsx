import "maplibre-gl/dist/maplibre-gl.css";

import Map, { NavigationControl } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";

import Supercluster from "supercluster";
import ThreeJsMarker from "../ThreeJsMarker";
import { useTheme } from "../../../../customHooks/useTheme";

const MAPTILER_KEY = "M31vd8Hi9hD0D3NWtZce";
const MAP_STYLE =
  "https://api.maptiler.com/maps/e6b564e1-da27-4cfd-9e87-d9928b008cdd/style.json?key={key}";

const createMarkerElement = (markerData) => {
  const el = document.createElement("div");
  el.className = "marker-container";

  // Create marker content
  const markerContent = document.createElement("div");
  markerContent.className = `marker-content ${
    markerData.status === "online" ? "online" : "offline"
  }`;

  // Add icon based on type
  const icon = document.createElement("div");
  icon.className = `marker-icon ${markerData.type || "default"}`;

  markerContent.appendChild(icon);
  el.appendChild(markerContent);

  return el;
};

const createClusterMarker = (count) => {
  const el = document.createElement("div");
  el.className = "cluster-marker";

  const inner = document.createElement("div");
  inner.className = "cluster-marker-inner";
  inner.textContent = count;

  el.appendChild(inner);
  return el;
};

const MapMarkers = ({ markers, useClusteredMarkers, onMarkerClick }) => {
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [supercluster, setSupercluster] = useState(null);

  useEffect(() => {
    if (!useClusteredMarkers) {
      setVisibleMarkers(
        markers.map((marker) => ({
          type: "Feature",
          properties: { ...marker, cluster: false },
          geometry: {
            type: "Point",
            coordinates: [
              marker.lng || marker.longitude,
              marker.lat || marker.latitude,
            ],
          },
        }))
      );
      return;
    }

    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 16,
      minPoints: 2,
    });

    if (markers.length > 0) {
      const points = markers.map((marker) => ({
        type: "Feature",
        properties: { ...marker },
        geometry: {
          type: "Point",
          coordinates: [
            marker.lng || marker.longitude,
            marker.lat || marker.latitude,
          ],
        },
      }));

      cluster.load(points);
      setSupercluster(cluster);
      updateClusters(cluster);
    }
  }, [markers, useClusteredMarkers]);

  const updateClusters = (cluster) => {
    if (!cluster) return;

    const clusters = cluster.getClusters([-180, -85, 180, 85], 0);

    setVisibleMarkers(clusters);
  };

  return visibleMarkers.map((point, index) => {
    const [lng, lat] = point.geometry.coordinates;
    const { cluster, cluster_id, point_count } = point.properties;

    if (cluster) {
      return (
        <div
          key={`cluster-${cluster_id}`}
          style={{
            position: "absolute",
            left: `${lng}px`,
            top: `${lat}px`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {createClusterMarker(point_count)}
        </div>
      );
    }

    return (
      <div
        key={`marker-${point.properties.id || index}`}
        style={{
          position: "absolute",
          left: `${lng}px`,
          top: `${lat}px`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {createMarkerElement(point.properties)}
      </div>
    );
  });
};

export default function MapLibreLayer({
  markers = [],
  onMarkerClick,
  useClusteredMarkers = true,
}) {
  const { show3DLayer } = useTheme();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        initialViewState={{
          longitude: 69.30783347820702,
          latitude: 41.30512407773824,
          zoom: 15,
          pitch: 0,
          bearing: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        transformRequest={(url, resourceType) => {
          if (url.includes("{key}")) {
            return {
              url: url.replace("{key}", MAPTILER_KEY),
            };
          }
        }}
      >
        <NavigationControl />
        <MapMarkers
          markers={markers}
          useClusteredMarkers={useClusteredMarkers}
          onMarkerClick={onMarkerClick}
        />
        <ThreeJsMarker
          longitude={69.30783347820702}
          latitude={41.30512407773824}
        />
      </Map>
    </div>
  );
}
