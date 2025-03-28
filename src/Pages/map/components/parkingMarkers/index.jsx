import { useEffect, useRef, useState } from "react";

import { FaParking } from "react-icons/fa";
import PropTypes from "prop-types";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";

const ParkingMarkers = ({ map }) => {
  const markersRef = useRef({});
  const [parkingLots, setParkingLots] = useState([]);
  useEffect(() => {
    setTimeout(
      () =>
        setParkingLots([
          {
            id: 1,
            name: "Central Parking",
            type: "area",
            coordinates: [69.2401, 41.2995],
            capacity: 150,
            available: 45,
            area: 2500,
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.2401, 41.2995],
                  [69.2411, 41.2995],
                  [69.2411, 41.2985],
                  [69.2401, 41.2985],
                  [69.2401, 41.2995],
                ],
              ],
            },
          },
          {
            id: 2,
            name: "West Station Parking",
            type: "line",
            coordinates: [69.2431, 41.2965],
            capacity: 80,
            available: 23,
            length: 100,
            geometry: {
              type: "LineString",
              coordinates: [
                [69.2431, 41.2965],
                [69.2441, 41.2965],
              ],
            },
          },

          {
            id: 4,
            name: "North Plaza Parking",
            type: "area",
            coordinates: [69.2395, 41.301],
            capacity: 120,
            available: 20,
            area: 2200,
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.2395, 41.301],
                  [69.2405, 41.301],
                  [69.2405, 41.3],
                  [69.2395, 41.3],
                  [69.2395, 41.301],
                ],
              ],
            },
          },
          {
            id: 5,
            name: "South Avenue Parking",
            type: "area",
            coordinates: [69.242, 41.295],
            capacity: 100,
            available: 98,
            area: 2000,
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.242, 41.295],
                  [69.243, 41.295],
                  [69.243, 41.294],
                  [69.242, 41.294],
                  [69.242, 41.295],
                ],
              ],
            },
          },
          {
            id: 6,
            name: "Riverbank Parking",
            type: "line",
            coordinates: [69.2455, 41.2975],
            capacity: 90,
            available: 40,
            length: 120,
            geometry: {
              type: "LineString",
              coordinates: [
                [69.2455, 41.2975],
                [69.2465, 41.2975],
              ],
            },
          },
          {
            id: 7,
            name: "Mall Underground Parking",
            type: "area",
            coordinates: [69.247, 41.298],
            capacity: 200,
            available: 75,
            area: 3000,
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [69.247, 41.298],
                  [69.248, 41.298],
                  [69.248, 41.297],
                  [69.247, 41.297],
                  [69.247, 41.298],
                ],
              ],
            },
          },
        ]),
      500
    );

    return () => {
      setParkingLots([]);
    };
  }, []);

  // Function to calculate center point of a line
  const getLineCenter = (coordinates) => {
    const [start, end] = coordinates;
    return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  };

  useEffect(() => {
    if (!map && parkingLots.length == 0) return;

    // Add sources and layers for both area and line parking lots
    map.addSource("parking-areas", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: parkingLots
          .filter((lot) => lot.type === "area")
          .map((lot) => ({
            type: "Feature",
            geometry: lot.geometry,
            properties: {
              id: lot.id,
              name: lot.name,
              capacity: lot.capacity,
              available: lot.available,
              area: lot.area,
            },
          })),
      },
    });

    map.addSource("parking-lines", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: parkingLots
          .filter((lot) => lot.type === "line")
          .map((lot) => ({
            type: "Feature",
            geometry: lot.geometry,
            properties: {
              id: lot.id,
              name: lot.name,
              capacity: lot.capacity,
              available: lot.available,
              length: lot.length,
            },
          })),
      },
    });

    // Add hover states
    const hoverStateId = "hover";
    map.addLayer({
      id: hoverStateId,
      type: "line",
      source: "parking-areas",
      layout: {},
      paint: {
        "line-color": "#1e40af",
        "line-width": 2,
      },
      filter: ["==", "id", ""],
    });

    // Add area layer
    // Add area layers
    map.addLayer({
      id: "parking-areas-fill",
      type: "fill",
      source: "parking-areas",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["/", ["get", "available"], ["get", "capacity"]],
          0,
          "#ef4444", // Red when full
          0.5,
          "#eab308", // Yellow at 50% capacity
          1,
          "#22c55e", // Green when empty
        ],
        "fill-opacity": 0.6,
      },
    });

    // Add line layer
    map.addLayer({
      id: "parking-lines-line",
      type: "line",
      source: "parking-lines",
      paint: {
        "line-color": [
          "interpolate",
          ["linear"],
          ["/", ["get", "available"], ["get", "capacity"]],
          0,
          "#ef4444", // Red when full
          0.5,
          "#eab308", // Yellow at 50% capacity
          1,
          "#22c55e", // Green when empty
        ],
        "line-width": 6,
      },
    });

    map.addLayer({
      id: "parking-areas-outline",
      type: "line",
      source: "parking-areas",
      paint: {
        "line-color": "#1e293b",
        "line-width": 2,
      },
    });

    // Add hover interactions
    const handleHover = (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        map.setFilter(hoverStateId, ["==", "id", feature.properties.id]);
      }
    };

    const handleMouseLeave = () => {
      map.setFilter(hoverStateId, ["==", "id", ""]);
    };

    map.on("mousemove", "parking-areas-fill", handleHover);
    map.on("mouseleave", "parking-areas-fill", handleMouseLeave);
    map.on("mousemove", "parking-lines-line", handleHover);
    map.on("mouseleave", "parking-lines-line", handleMouseLeave);

    // Add background for line labels
    map.addLayer({
      id: "parking-lines-label-bg",
      type: "symbol",
      source: "parking-lines",
      layout: {
        "text-field": "⬚",
        "text-font": ["Open Sans Regular"],
        "text-size": 16,
        "text-anchor": "top",
        "text-justify": "center",
        "symbol-placement": "line-center",
        "text-offset": [0, -1],
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#2563eb",
        "text-halo-width": 8,
        "text-opacity": 0.9,
      },
    });

    // Add labels for line parking areas
    map.addLayer({
      id: "parking-lines-labels",
      type: "symbol",
      source: "parking-lines",
      layout: {
        "text-field": [
          "format",
          ["get", "length"],
          { "font-scale": 1.2, "font-weight": 600 },
          " m",
          { "font-scale": 0.9, "text-color": "#ffffff" },
        ],
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        "text-size": 14,
        "text-anchor": "top",
        "text-justify": "center",
        "symbol-placement": "line-center",
        "text-offset": [0, -1],
        "text-padding": 2,
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#2563eb",
        "text-halo-width": 0.5,
      },
    });

    // Add markers with popups
    parkingLots.forEach((lot) => {
      const occupancyRate = (
        ((lot.capacity - lot.available) / lot.capacity) *
        100
      ).toFixed(0);
      const occupancyColor =
        occupancyRate > 75
          ? "#ef4444"
          : occupancyRate > 50
          ? "#eab308"
          : "#22c55e";

      // Only create markers for area type parking lots

      // Create marker element
      const el = document.createElement("div");
      el.className = "parking-marker";
      el.innerHTML = renderToString(
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <FaParking className="w-5 h-5" />
        </div>
      );

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "300px",
        className: "parking-popup",
      }).setHTML(`
          <div class="p-4 text-sm bg-white rounded-lg shadow-lg">
            <div class="flex items-center gap-2 mb-3">
              <div class="p-2 bg-blue-600 rounded-full">
                ${renderToString(<FaParking className="w-4 h-4 text-white" />)}
              </div>
              <h3 class="font-bold text-lg text-gray-900">${lot.name}</h3>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Occupancy:</span>
                <span class="font-medium" style="color: ${occupancyColor}">${occupancyRate}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Available:</span>
                <span class="font-medium text-gray-900">${lot.available}/${
        lot.capacity
      } spots</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">${
                  lot.type === "area" ? "Area:" : "Length:"
                }</span>
                <span class="font-medium text-gray-900">${
                  lot.type === "area" ? `${lot.area}m²` : `${lot.length}m`
                }</span>
              </div>
            </div>
          </div>
        `);

      // Create and store marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lot.coordinates)
        .setPopup(popup)
        .addTo(map);

      markersRef.current[lot.id] = marker;
    });

    const markers = markersRef.current;
    return () => {
      // Cleanup
      if (map.getLayer("parking-areas-fill"))
        map.removeLayer("parking-areas-fill");
      if (map.getLayer("parking-areas-outline"))
        map.removeLayer("parking-areas-outline");
      if (map.getLayer("parking-lines-line"))
        map.removeLayer("parking-lines-line");
      if (map.getSource("parking-areas")) map.removeSource("parking-areas");
      if (map.getSource("parking-lines")) map.removeSource("parking-lines");

      Object.values(markers).forEach((marker) => marker.remove());
    };
  }, [map, parkingLots]);

  return null;
};

ParkingMarkers.propTypes = {
  map: PropTypes.shape({
    addSource: PropTypes.func,
    addLayer: PropTypes.func,
    getLayer: PropTypes.func,
    removeLayer: PropTypes.func,
    getSource: PropTypes.func,
    removeSource: PropTypes.func,
    on: PropTypes.func,
    setFilter: PropTypes.func,
  }),
};

export default ParkingMarkers;
