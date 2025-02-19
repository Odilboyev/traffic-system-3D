import "./styles.css";

import { useEffect, useRef } from "react";

import Supercluster from "supercluster";
import maplibregl from "maplibre-gl";

const PulsingMarkers = ({ map, markers }) => {
  const supercluster = useRef(new Supercluster({ radius: 100, maxZoom: 16 }));
  const markersRef = useRef([]);

  useEffect(() => {
    if (!map || !markers) return;

    // Filter and prepare markers
    const type2Markers = markers.filter((marker) => marker.type === 2);
    const points = type2Markers.map((marker) => ({
      type: "Feature",
      properties: { ...marker },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(marker.lng), parseFloat(marker.lat)],
      },
    }));

    // Update supercluster with new points
    supercluster.current.load(points);

    // Function to update markers based on viewport
    const updateMarkers = () => {
      // Remove all existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const bounds = map.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      const zoom = Math.floor(map.getZoom());
      const clusters = supercluster.current.getClusters(bbox, zoom);

      clusters.forEach((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;

        const el = document.createElement("div");
        el.className = "marker-container";

        const markerEl = document.createElement("div");
        markerEl.className = "pulsing-marker";
        
        if (cluster.properties.cluster) {
          const count = cluster.properties.point_count;
          markerEl.setAttribute('data-count', count);
          markerEl.classList.add('cluster-marker');
        }
        
        el.appendChild(markerEl);

        const marker = new maplibregl.Marker({
          element: el,
          anchor: "center",
          offset: [0, 0],
        })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    // Update markers initially and on map events
    updateMarkers();
    map.on("moveend", updateMarkers);
    map.on("zoomend", updateMarkers);

    return () => {
      // Clean up all markers when component unmounts
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.off("moveend", updateMarkers);
      map.off("zoomend", updateMarkers);
    };
  }, [map, markers]);

  return null;
};

export default PulsingMarkers;
