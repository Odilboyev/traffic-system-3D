import "./styles.css";

import { FaBus, FaSubway, FaTram } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import TransportFilter from "./TransportFilter";
import TransportPopup from "./TransportPopup";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import { usePublicTransport } from "../../hooks/usePublicTransport";
import { useTransport } from "../../context/TransportContext";

const getTransportIcon = (type) => {
  switch (type) {
    case "bus":
      return FaBus;
    case "metro":
      return FaSubway;
    case "tram":
      return FaTram;
    default:
      return FaBus;
  }
};

const TransportMarkerComponent = ({ vehicle, showNumber, showDot }) => {
  const Icon = FaBus; // All vehicles are buses in this case

  TransportMarkerComponent.propTypes = {
    vehicle: PropTypes.shape({
      bus_name: PropTypes.string,
      azimuth: PropTypes.number,
      locations: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    }).isRequired,
    showNumber: PropTypes.bool,
    showDot: PropTypes.bool,
  };

  if (showDot) {
    return (
      <div
        className="transport-marker-dot"
        style={{
          backgroundColor: "#3b82f6",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
        }}
      />
    );
  }

  return (
    <div
      className="transport-marker p-1"
      style={{
        backgroundColor: "#3b82f680",
        transform: `rotate(${vehicle.azimuth || 0}deg)`,
        transformOrigin: "center",
      }}
    >
      <div className="transport-marker-icon" style={{ color: "#3b82f6" }}>
        <Icon className="transport-marker-icon" />
      </div>
      {showNumber && (
        <div className="transport-marker-name">{vehicle.bus_name || ""}</div>
      )}
    </div>
  );
};

/**
 * Component for displaying transport markers on the map
 * @param {Object} props
 * @param {Object} props.map - MapLibre GL JS map instance
 */
function TransportMarkers({ map }) {
  const [selectedTypes, setSelectedTypes] = useState(["bus", "metro", "tram"]);
  const updateIntervalRef = useRef(null);

  const handleTypeToggle = useCallback((type) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);
      if (isSelected) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);
  const markersRef = useRef({});
  const routeSourcesRef = useRef({});
  const heatmapLayerRef = useRef(null);
  const popupRef = useRef(null);
  const { visualizationType } = useTransport();
  const {
    transportData,
    fetchTransportData,
    fetchRealtimeVehicles,
    clearTransportData,
    currentViewport,
    getFilteredRoutes,
    updateViewport,
  } = usePublicTransport();

  useEffect(() => {
    console.log(transportData, "vehicles changed");
  }, [transportData]);

  // Handle map movement and update viewport
  useEffect(() => {
    if (!map) return;

    const handleMapMove = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      updateViewport({
        topLeft: {
          x: bounds.getWest(),
          y: bounds.getNorth(),
        },
        bottomRight: {
          x: bounds.getEast(),
          y: bounds.getSouth(),
        },
        zoom: Math.round(zoom),
      });
    };

    // Update viewport on initial load
    handleMapMove();

    // Listen for map movement events
    map.on("moveend", handleMapMove);
    map.on("zoomend", handleMapMove);

    return () => {
      map.off("moveend", handleMapMove);
      map.off("zoomend", handleMapMove);
    };
  }, [map, updateViewport]);

  useEffect(() => {
    // Fetch transport data when component mounts or visualization type changes
    fetchTransportData();

    // Set up interval for fetching data every 4 seconds
    updateIntervalRef.current = setInterval(() => {
      fetchRealtimeVehicles({
        viewport: currentViewport,
        type: "online5",
        immersive: false,
      });
    }, 4000);

    // Clean up when component unmounts
    return () => {
      clearTransportData();
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      // Clean up markers and layers
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (heatmapLayerRef.current && map?.getLayer("transport-heat")) {
        map.removeLayer("transport-heat");
        map.removeSource("transport-heatmap");
        heatmapLayerRef.current = false;
      }
    };
  }, [fetchTransportData, clearTransportData, map]);

  // Handle zoom changes
  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      // Force markers update on zoom/drag change
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      updateViewport({
        topLeft: {
          x: bounds.getWest(),
          y: bounds.getNorth(),
        },
        bottomRight: {
          x: bounds.getEast(),
          y: bounds.getSouth(),
        },
        zoom: Math.round(zoom),
      });
    };

    map.on("zoomend", handleZoomEnd);
    map.on("dragend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
      map.off("dragend", handleZoomEnd);
    };
  }, [map, updateViewport]);

  // Add real-time vehicle markers to the map
  useEffect(() => {
    if (!map || !transportData?.viewportVehicles?.length) {
      // Clean up all markers if no data
      Object.values(markersRef.current).forEach((marker) => {
        if (marker.remove) marker.remove();
      });
      markersRef.current = {};
      return;
    }

    const zoom = map.getZoom();
    const currentMarkers = new Set(Object.keys(markersRef.current));

    // Create or update markers for viewport vehicles
    transportData.viewportVehicles.forEach((vehicle) => {
      if (!vehicle.locations || !vehicle.locations[0]) return; // Skip if no coordinates

      const markerId = vehicle.bus_name;
      currentMarkers.delete(markerId); // Remove from cleanup set

      // Create marker element
      let markerElement;
      let root;

      if (markersRef.current[markerId]) {
        // Update existing marker
        markerElement = markersRef.current[markerId].getElement();
        root = markerElement._reactRoot;
      } else {
        // Create new marker
        markerElement = document.createElement("div");
        markerElement.className = "transport-marker-container";
        root = createRoot(markerElement);
        markerElement._reactRoot = root;
      }

      // Determine marker style based on zoom level
      const showDot = zoom < 11;
      const showNumber = zoom >= 13;
      const showMarkerOnly = zoom >= 11 && zoom < 13;

      root.render(
        <TransportMarkerComponent
          vehicle={vehicle}
          showNumber={showNumber}
          showDot={showDot}
        />
      );

      const [longitude, latitude] = vehicle.locations[0];

      if (!markersRef.current[markerId]) {
        // Create new marker
        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: "center",
          pitchAlignment: "map",
        })
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Add hover effect for zoom levels 11-13
        if (showMarkerOnly) {
          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,

            className: "bus-number-popup",
          }).setHTML(`<div>${vehicle.bus_name}</div>`);

          markerElement.addEventListener("mouseenter", () => {
            marker.setPopup(popup);
            popup.addTo(map);
          });

          markerElement.addEventListener("mouseleave", () => {
            popup.remove();
          });
        }

        markersRef.current[markerId] = marker;
      } else {
        // Update existing marker position
        markersRef.current[markerId].setLngLat([longitude, latitude]);
      }
    });

    // Remove stale markers
    currentMarkers.forEach((markerId) => {
      if (markersRef.current[markerId]) {
        markersRef.current[markerId].remove();
        delete markersRef.current[markerId];
      }
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => {
        if (marker.remove) marker.remove();
      });
      markersRef.current = {};
    };
  }, [map, transportData?.viewportVehicles]);

  // Add route paths with simplification
  useEffect(() => {
    if (!map || !transportData?.routes?.length) return;

    const filteredRoutes = getFilteredRoutes();
    filteredRoutes.forEach((route) => {
      const sourceId = `route-${route.id}`;

      // Simplify coordinates based on current zoom level
      const zoom = map.getZoom();
      const tolerance = zoom < 12 ? 0.01 : zoom < 14 ? 0.005 : 0.001;

      // Skip every nth point based on zoom level to reduce density
      const skipPoints = zoom < 12 ? 4 : zoom < 14 ? 2 : 1;

      const simplifiedCoords = route.path
        .filter((_, index) => index % skipPoints === 0)
        .map((v) => v.reverse());

      // Create GeoJSON for the route path
      const geojson = {
        type: "Feature",
        properties: {
          name: route.name,
          type: route.type,
          color: route.color,
        },
        geometry: {
          type: "LineString",
          coordinates: simplifiedCoords,
        },
      };

      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });
      }

      // Update existing source data or add new source
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(geojson);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
          maxzoom: 16,
          tolerance: 5,
          buffer: 0,
        });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(`${sourceId}-layer`)) {
        if (visualizationType === "lines") {
          map.addLayer({
            id: `${sourceId}-layer`,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": route.color,
              "line-width": 4,
              "line-opacity": 0.7,
            },
          });

          // Add click event for the layer
          map.on("click", `${sourceId}-layer`, (e) => {
            // Remove existing popup if any
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }

            // Create popup element
            const popupElement = document.createElement("div");
            const popupRoot = createRoot(popupElement);

            // Render popup content
            popupRoot.render(
              <TransportPopup
                route={route}
                onClose={() => {
                  if (popupRef.current) {
                    popupRef.current.remove();
                    popupRef.current = null;
                  }
                }}
              />
            );

            // Create and add popup to map
            const popup = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              anchor: "top",
              offset: [0, 0],
              className: "transport-popup",
            })
              .setLngLat(e.lngLat)
              .setDOMContent(popupElement)
              .addTo(map);

            popupRef.current = popup;
          });

          // Change cursor to pointer when hovering over route lines
          map.on("mouseover", `${sourceId}-layer`, () => {
            map.getCanvas().style.cursor = "pointer";
          });

          // Change cursor back when leaving route lines
          map.on("mouseleave", `${sourceId}-layer`, () => {
            map.getCanvas().style.cursor = "";
          });
        } else if (visualizationType === "heatmap") {
          map.addLayer({
            id: `${sourceId}-layer`,
            type: "heatmap",
            source: sourceId,
            paint: {
              "heatmap-weight": 1,
              "heatmap-intensity": 1,
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0, 0, 255, 0)",
                0.2,
                "rgba(0, 0, 255, 0.2)",
                0.4,
                "rgba(0, 255, 0, 0.4)",
                0.6,
                "rgba(255, 255, 0, 0.6)",
                0.8,
                "rgba(255, 128, 0, 0.8)",
                1,
                "rgba(255, 0, 0, 1)",
              ],
              "heatmap-radius": 15,
            },
          });
        }

        // Add hover effect
        map.on("mouseenter", `${sourceId}-layer`, () => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty(`${sourceId}-layer`, "line-width", 6);
        });

        const layerId = `${sourceId}-layer`;

        const handleMouseLeave = () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty(layerId, "line-width", 4);
        };

        const handleClick = () => {
          // Handle route click - could show route details
          console.log("Route clicked:", route);
        };

        // Add event listeners
        map.on("mouseleave", layerId, handleMouseLeave);
        map.on("click", layerId, handleClick);

        // Store event handlers for cleanup
        routeSourcesRef.current[sourceId] = {
          layerId,
          handlers: { handleMouseLeave, handleClick },
        };
      }
    });

    // Cleanup function
    return () => {
      if (!map) return;

      // Clean up event listeners and layers
      Object.entries(routeSourcesRef.current).forEach(
        ([sourceId, { layerId, handlers }]) => {
          if (map.getLayer(layerId)) {
            // Remove event listeners
            map.off("mouseleave", layerId, handlers.handleMouseLeave);
            map.off("click", layerId, handlers.handleClick);
            map.removeLayer(layerId);
          }
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        }
      );
      routeSourcesRef.current = {};
    };
  }, [map]);

  // Add click handler for bus markers
  useEffect(() => {
    if (!map || !transportData?.viewportVehicles?.length) {
      return;
    }

    const markerClickListeners = new Map();

    /**
     * Handle marker click event
     * @param {Object} vehicle - Vehicle data
     */
    const handleMarkerClick = (vehicle) => {
      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Create popup element
      const popupElement = document.createElement("div");
      const popupRoot = createRoot(popupElement);

      // Render popup content
      popupRoot.render(
        <TransportPopup
          vehicle={{
            name: vehicle.bus_name,
            speed: 0, // Speed not available in new data structure
            timestamp: new Date().toISOString(), // Timestamp not available
            direction: 0, // Direction not available
          }}
          onClose={() => {
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }
          }}
        />
      );

      // Create and add popup
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: "top",
        offset: [0, -10],
        className: "transport-popup",
      })
        .setLngLat(vehicle.locations[0]) // Use first location for popup
        .setDOMContent(popupElement)
        .addTo(map);

      popupRef.current = popup;
    };

    // Add click listeners to all markers
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const vehicle = transportData.viewportVehicles.find(
        (v) => v.bus_name === id
      );
      if (vehicle) {
        const clickHandler = () => handleMarkerClick(vehicle);
        marker.getElement().addEventListener("click", clickHandler);
        markerClickListeners.set(id, clickHandler);
      }
    });

    // Cleanup function
    return () => {
      // Clean up click listeners and popup
      markerClickListeners.forEach((handler, id) => {
        const marker = markersRef.current[id];
        if (marker) {
          marker.getElement().removeEventListener("click", handler);
        }
      });
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, transportData?.viewportVehicles, popupRef]);

  return (
    <TransportFilter
      selectedTypes={selectedTypes}
      onTypeToggle={handleTypeToggle}
    />
  );
}

TransportMarkers.propTypes = {
  map: PropTypes.object,
  visualizationType: PropTypes.oneOf(["lines", "heatmap"]),
};

export default TransportMarkers;
