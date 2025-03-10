import "./styles.css";

import { FaBus, FaSubway, FaTram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom/client";
import TransportPopup from "./TransportPopup";
import maplibregl from "maplibre-gl";
import { usePublicTransport } from "../../hooks/usePublicTransport";

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

const TransportMarkerComponent = ({ vehicle, route }) => {
  const Icon = getTransportIcon(vehicle.type);

  return (
    <div
      className="transport-marker"
      style={{ backgroundColor: `${route.color}40` }}
    >
      <div className="transport-marker-icon" style={{ color: route.color }}>
        <Icon />
      </div>
      <div className="transport-marker-name">{route.name}</div>
    </div>
  );
};

const TransportMarkers = ({ map }) => {
  const markersRef = useRef({});
  const routeSourcesRef = useRef({});
  const popupRef = useRef(null);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const {
    transportData,
    fetchTransportData,
    clearTransportData,
    selectVehicle,
    clearSelectedVehicle,
    getFilteredRoutes,
    getFilteredVehicles,
    isLoading,
    error,
  } = usePublicTransport();

  useEffect(() => {
    // Fetch transport data when component mounts
    fetchTransportData();

    // Clean up when component unmounts
    return () => {
      clearTransportData();
    };
  }, []);

  // Add route paths to the map
  useEffect(() => {
    if (!map || !transportData.routes.length) return;

    // Clean up existing sources and layers
    Object.keys(routeSourcesRef.current).forEach((sourceId) => {
      if (map.getLayer(`${sourceId}-layer`)) {
        map.removeLayer(`${sourceId}-layer`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });
    routeSourcesRef.current = {};

    // Get filtered routes
    const filteredRoutes = getFilteredRoutes();

    // Add new sources and layers for each route
    filteredRoutes.forEach((route) => {
      const sourceId = `route-${route.id}`;

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
          coordinates: route.path,
        },
      };

      // Add source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });
      }

      // Add layer if it doesn't exist
      if (!map.getLayer(`${sourceId}-layer`)) {
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

        // Add hover effect
        map.on("mouseenter", `${sourceId}-layer`, () => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty(`${sourceId}-layer`, "line-width", 6);
        });

        map.on("mouseleave", `${sourceId}-layer`, () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty(`${sourceId}-layer`, "line-width", 4);
        });

        // Add click event
        map.on("click", `${sourceId}-layer`, () => {
          // Handle route click - could show route details
          console.log("Route clicked:", route);
        });
      }

      // Store source reference for cleanup
      routeSourcesRef.current[sourceId] = true;
    });

    // Cleanup function
    return () => {
      Object.keys(routeSourcesRef.current).forEach((sourceId) => {
        if (map.getLayer(`${sourceId}-layer`)) {
          map.removeLayer(`${sourceId}-layer`);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
    };
  }, [map, transportData.routes, getFilteredRoutes]);

  // Add vehicle markers to the map
  useEffect(() => {
    if (!map || !transportData.vehicles.length || !transportData.routes.length)
      return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Get filtered vehicles
    const filteredVehicles = getFilteredVehicles();

    // Add new markers
    filteredVehicles.forEach((vehicle) => {
      // Find the route this vehicle belongs to
      const route = transportData.routes.find((r) => r.id === vehicle.routeId);
      if (!route) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "-marker-container";
      markerElement.style.transform = `rotate(${vehicle.heading}deg)`;

      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<TransportMarkerComponent vehicle={vehicle} route={route} />);

      // Create the marker and add it to the map
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat(vehicle.coordinates)
        .addTo(map);

      // Add click event to show popup
      markerElement.addEventListener("click", () => {
        // Remove existing popup if any
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }

        // Create popup element
        const popupElement = document.createElement("div");
        const popupRoot = ReactDOM.createRoot(popupElement);

        // Render popup content
        popupRoot.render(
          <TransportPopup
            vehicle={vehicle}
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
          offset: [0, -10],
          className: "transport-popup",
        })
          .setLngLat(vehicle.coordinates)
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveVehicle(vehicle);
        selectVehicle(vehicle);
      });

      // Store marker reference for cleanup
      markersRef.current[vehicle.id] = marker;
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [
    map,
    transportData.vehicles,
    transportData.routes,
    getFilteredVehicles,
    selectVehicle,
  ]);

  return null; // This component doesn't render anything directly
};

export default TransportMarkers;
