import "./styles.css";

import { useEffect, useRef } from "react";

import Supercluster from "supercluster";
import maplibregl from "maplibre-gl";

const PulsingMarkers = ({ map, markers }) => {
  const markersRef = useRef([]);
  const superclusterRef = useRef(null);

  const createMarkerElement = (count = 1) => {
    const el = document.createElement("div");
    const container = document.createElement("div");
    const innerChild = document.createElement("div");
    const innerChildSecond = document.createElement("div");
    const countElement = count > 1 ? document.createElement("div") : null;

    container.className =
      "relative flex w-[0.8vw] h-[0.8vw] justify-center items-center";

    innerChild.className =
      "absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75";

    innerChildSecond.className =
      "relative inline-flex w-[0.4vw] h-[0.4vw] rounded-full bg-green-500 border border-white";

    if (count > 1) {
      countElement.className = "text-white text-xs font-bold";
      // countElement.textContent = count;
      innerChildSecond.appendChild(countElement);
    }

    container.appendChild(innerChildSecond);
    container.appendChild(innerChild);
    el.appendChild(container);
    return el;
  };

  const updateMarkers = () => {
    if (!map || !superclusterRef.current) return;

    // Clean up existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());

    const clusters = superclusterRef.current.getClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      zoom
    );

    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const el = createMarkerElement(
        cluster.properties.cluster ? cluster.properties.point_count : 1
      );

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!map || !markers) return;

    // Filter and prepare markers
    const type2Markers = markers.filter((marker) => marker.type === 2);

    // Initialize supercluster
    superclusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
      minZoom: 0,
    });

    // Add points to supercluster
    const points = type2Markers
      .map((marker) => {
        const lng = parseFloat(marker.lng);
        const lat = parseFloat(marker.lat);

        if (isNaN(lng) || isNaN(lat)) {
          console.warn(
            `Invalid coordinates for marker ${marker.cid}: [${marker.lng}, ${marker.lat}]`
          );
          return null;
        }

        return {
          type: "Feature",
          properties: { ...marker },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      })
      .filter((point) => point !== null);

    superclusterRef.current.load(points);

    // Initial render of markers
    updateMarkers();

    // Add event listeners for map movement
    map.on("moveend", updateMarkers);
    map.on("zoomend", updateMarkers);

    return () => {
      map.off("moveend", updateMarkers);
      map.off("zoomend", updateMarkers);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, markers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, []);

  return null;
};

export default PulsingMarkers;
