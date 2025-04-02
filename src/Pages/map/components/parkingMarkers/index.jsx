import "./styles.css";

import {
  FaBuilding,
  FaClock,
  FaMapMarkerAlt,
  FaParking,
  FaPhone,
} from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import { getParkingLots } from "../../../../api/api.handlers";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";

const ParkingMarkers = ({ map }) => {
  const { t } = useTranslation();
  const markersRef = useRef({});
  const [parkingLots, setParkingLots] = useState([]);
  // Helper function to clean up markers
  const cleanupMarkers = () => {
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
  };

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkingLots();
        if (!data) return;

        const formattedData = data.map((lot) => {
          let locationCenter, locationArea;
          try {
            locationCenter = JSON.parse(lot.location_center);
            locationArea = JSON.parse(lot.location_area);

            // Validate location area first - required
            if (
              !locationArea ||
              !Array.isArray(locationArea) ||
              locationArea.length === 0
            ) {
              console.warn(
                `Invalid or missing location area for parking lot ${lot.id}`
              );
              return;
            }

            // For center coordinates, fall back to first point of area if needed
            if (
              !locationCenter ||
              !Array.isArray(locationCenter) ||
              locationCenter.length !== 2
            ) {
              console.warn(
                `Invalid location center for parking lot ${lot.id}, using first area point`
              );
              locationCenter = locationArea[0];
            }

            // Convert coordinates from [lat, lng] to [lng, lat] format
            locationCenter = [locationCenter[1], locationCenter[0]];
            locationArea = locationArea.map((point) => [point[1], point[0]]);
          } catch (error) {
            console.warn(
              `Invalid location data for parking lot ${lot.id}:`,
              error
            );
            return;
          }

          return {
            id: lot.id,
            name: lot.name,
            type: lot.location_type === "polyline" ? "line" : "area",
            coordinates: locationCenter,
            space_max: lot.space_max,
            space_busy: lot.space_busy,
            space_free: lot.space_free,
            today_count: lot.today_count,
            floors: lot.floors,
            organization: lot.tashkilot,
            working_hours: lot.ish_vaqti,
            phone: lot.telefon,
            region_name: lot.region_name,
            district_name: lot.district_name,
            geometry: {
              type: lot.location_type === "polyline" ? "LineString" : "Polygon",
              coordinates:
                lot.location_type === "polyline"
                  ? locationArea
                  : [locationArea],
            },
            load: lot.load,
            img: lot.img_link,
          };
        });

        console.log(formattedData, "lol");
        setParkingLots(formattedData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkingData();

    return () => {
      setParkingLots([]);
      cleanupMarkers();
    };
  }, []);

  // Cleanup map sources and layers when component unmounts
  useEffect(() => {
    return () => {
      if (!map) return;
      try {
        // Remove event listeners
        map.off("mousemove", "parking-areas-fill");
        map.off("mouseleave", "parking-areas-fill");
        map.off("mousemove", "parking-lines-line");
        map.off("mouseleave", "parking-lines-line");

        // Remove layers
        if (map.getLayer("parking-lines-label-bg"))
          map.removeLayer("parking-lines-label-bg");
        if (map.getLayer("parking-areas-outline"))
          map.removeLayer("parking-areas-outline");
        if (map.getLayer("parking-lines-line"))
          map.removeLayer("parking-lines-line");
        if (map.getLayer("parking-lines-labels"))
          map.removeLayer("parking-lines-labels");
        if (map.getLayer("parking-areas-fill"))
          map.removeLayer("parking-areas-fill");
        if (map.getLayer("hover")) map.removeLayer("hover");

        // Remove sources
        if (map.getSource("parking-areas")) map.removeSource("parking-areas");
        if (map.getSource("parking-lines")) map.removeSource("parking-lines");
      } catch (error) {
        console.error("Error cleaning up map resources:", error);
      }
    };
  }, [map]);

  // Helper function to safely add layer
  const safeAddLayer = useCallback(
    (layerConfig) => {
      if (!map) return;
      if (map.getLayer(layerConfig.id)) {
        map.removeLayer(layerConfig.id);
      }
      map.addLayer(layerConfig);
    },
    [map]
  );

  useEffect(() => {
    if (!map || parkingLots.length === 0) return;

    // Add hover interactions
    const hoverStateId = "hover";
    const handleHover = (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        map.setFilter(hoverStateId, ["==", "id", feature.properties.id]);
      }
    };

    const handleMouseLeave = () => {
      map.setFilter(hoverStateId, ["==", "id", ""]);
    };
    try {
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
                space_max: lot.space_max,
                space_busy: lot.space_busy,
                space_free: lot.space_free,
                today_count: lot.today_count,
                floors: lot.floors,
                organization: lot.organization,
                working_hours: lot.working_hours,
                phone: lot.phone,
                region_name: lot.region_name,
                district_name: lot.district_name,
                load: lot.load,
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
                space_max: lot.space_max,
                space_busy: lot.space_busy,
                space_free: lot.space_free,
                today_count: lot.today_count,
                floors: lot.floors,
                organization: lot.organization,
                working_hours: lot.working_hours,
                phone: lot.phone,
                region_name: lot.region_name,
                district_name: lot.district_name,
                load: lot.load,
                img: lot.img_link,
              },
            })),
        },
      });
      console.log(parkingLots, "parking lines");
      // Add layers in correct order
      safeAddLayer({
        id: "parking-areas-fill",
        type: "fill",
        source: "parking-areas",
        paint: {
          "fill-color": [
            "match",
            ["get", "load"],
            1,
            "#22c55e", // Green - normal
            2,
            "#eab308", // Yellow - medium load
            3,
            "#f97316", // Orange - high load
            4,
            "#ef4444", // Red - critical
            "#ef4444", // Default red
          ],
          "fill-opacity": 0.6,
        },
      });

      safeAddLayer({
        id: "hover",
        type: "line",
        source: "parking-areas",
        layout: {},
        paint: {
          "line-color": "#1e40af",
          "line-width": 2,
        },
        filter: ["==", "id", ""],
      });

      safeAddLayer({
        id: "parking-lines-line",
        type: "line",
        source: "parking-lines",
        paint: {
          "line-color": [
            "match",
            ["get", "load"],
            1,
            "#22c55e", // Green - normal
            2,
            "#eab308", // Yellow - medium load
            3,
            "#f97316", // Orange - high load
            4,
            "#ef4444", // Red - critical
            "#ef4444", // Default red
          ],
          "line-width": 6,
        },
      });

      safeAddLayer({
        id: "parking-areas-outline",
        type: "line",
        source: "parking-areas",
        paint: {
          "line-color": "#1e293b",
          "line-width": 2,
        },
      });

      safeAddLayer({
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
          "text-color": "#1e293b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      map.on("mousemove", "parking-areas-fill", handleHover);
      map.on("mouseleave", "parking-areas-fill", handleMouseLeave);
      map.on("mousemove", "parking-lines-line", handleHover);
      map.on("mouseleave", "parking-lines-line", handleMouseLeave);
    } catch (error) {
      console.error("Error setting up map layers:", error);
    }

    safeAddLayer({
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
          ["get", "name"],
          { "font-scale": 1.2, "font-weight": 600 },
          "",
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
      // Calculate load color based on status
      const getLoadColor = (load) => {
        switch (load) {
          case 1:
            return "#22c55e"; // Green - normal
          case 2:
            return "#eab308"; // Yellow - medium load
          case 3:
            return "#f97316"; // Orange - high load
          case 4:
            return "#ef4444"; // Red - critical
          default:
            return "#2563eb"; // Default red
        }
      };

      const loadColor = getLoadColor(lot.load);
      const occupancyRate = ((lot.space_busy / lot.space_max) * 100).toFixed(0);

      // Create marker element
      const el = document.createElement("div");
      el.className = "parking-marker group";
      el.innerHTML = renderToString(
        <div
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-transform hover:scale-110"
          style={{ border: `2px solid #2563eb` }}
        >
          <FaParking className="text-lg" style={{ color: "#2563eb" }} />
        </div>
      );

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "300px",
        className: "parking-popup",
      }).setHTML(`
          <div class="p-4 text-sm rounded-xl shadow-xl !bg-gradient-to-br from-blue-950/95 to-gray-900/95 backdrop-blur-lg border border-blue-800/20">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${loadColor}"></div>
              <h3 class="text-base font-bold text-white tracking-tight">${
                lot.name
              }</h3>
            </div>
            
            <div class="grid gap-2 text-gray-300 mb-3">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-blue-400">${renderToString(
                  <FaBuilding className="w-3.5 h-3.5" />
                )}</span>
                <span class="text-gray-300 text-sm">${lot.organization}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-blue-400">${renderToString(
                  <FaPhone className="w-3.5 h-3.5" />
                )}</span>
                <span class="text-gray-300 text-sm">${lot.phone}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-blue-400">${renderToString(
                  <FaMapMarkerAlt className="w-3.5 h-3.5" />
                )}</span>
                <span class="text-gray-300 text-sm">${lot.region_name}, ${
        lot.district_name
      }</span>
              </div>
            </div>
            
            <div class="p-2.5 bg-blue-950/50 rounded-lg border border-blue-900/30 backdrop-blur-sm">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-1.5">
                  <span class="inline-block w-1.5 h-1.5 rounded-full" style="background-color: ${loadColor}"></span>
                  <span class="text-blue-300 text-xs font-medium">${t(
                    "current_status"
                  )}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-white text-xs font-bold" style="background: ${loadColor}">
                  ${occupancyRate}% ${t("full")}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <div class="p-2 bg-blue-900/20 rounded-md">
                  <div class="flex justify-between">
                    <span class="text-[10px] text-blue-300 font-medium">${t(
                      "total"
                    )}</span>
                    <span class="text-sm font-bold text-white">${
                      lot.space_max
                    }</span>
                  </div>
                </div>
                <div class="p-2 bg-blue-900/20 rounded-md">
                  <div class="flex justify-between">
                    <span class="text-[10px] text-blue-300 font-medium">${t(
                      "busy"
                    )}</span>
                    <span class="text-sm font-bold text-white">${
                      lot.space_busy
                    }</span>
                  </div>
                </div>
                <div class="p-2 bg-blue-900/20 rounded-md">
                  <div class="flex justify-between">
                    <span class="text-[10px] text-blue-300 font-medium">${t(
                      "free"
                    )}</span>
                    <span class="text-sm font-bold text-white">${
                      lot.space_free
                    }</span>
                  </div>
                </div>
                <div class="p-2 bg-blue-900/20 rounded-md">
                  <div class="flex justify-between">
                    <span class="text-[10px] text-blue-300 font-medium">
                    ${t("today")}</span>
                    <span class="text-sm font-bold text-white">
                    ${lot.today_count}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mt-3 text-xs">
              <span class="text-blue-400">${renderToString(
                <FaClock className="w-3.5 h-3.5" />
              )}</span>
              <span class="text-gray-300">${lot.working_hours}</span>
            </div>
            
            <img 
              src="${lot.img}"
              alt="Parking Preview" 
              class="w-full h-24 object-cover rounded-lg mt-3 opacity-90 shadow-lg"/>
          </div>
      `);

      // Create and store marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lot.coordinates)
        .setPopup(popup)
        .addTo(map);

      markersRef.current[lot.id] = marker;
    });

    return () => {
      // Cleanup layers and sources
      if (map.getLayer("parking-areas-fill"))
        map.removeLayer("parking-areas-fill");
      if (map.getLayer("parking-areas-outline"))
        map.removeLayer("parking-areas-outline");
      if (map.getLayer("hover")) map.removeLayer("hover");
      if (map.getLayer("parking-lines-label-bg"))
        map.removeLayer("parking-lines-label-bg");
      if (map.getLayer("parking-lines-labels"))
        map.removeLayer("parking-lines-labels");
      if (map.getLayer("parking-lines-line"))
        map.removeLayer("parking-lines-line");

      // Remove sources after removing all layers
      if (map.getSource("parking-areas")) map.removeSource("parking-areas");
      if (map.getSource("parking-lines")) map.removeSource("parking-lines");

      // Clean up all markers
      cleanupMarkers();
    };
  }, [map, parkingLots, safeAddLayer]);

  return null;
};

ParkingMarkers.propTypes = {
  map: PropTypes.shape({
    addSource: PropTypes.func,
    addLayer: PropTypes.func,
    removeLayer: PropTypes.func,
    removeSource: PropTypes.func,
    getLayer: PropTypes.func,
    getSource: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
    setFilter: PropTypes.func,
  }),
};

export default ParkingMarkers;
