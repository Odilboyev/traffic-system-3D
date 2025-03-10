import "./styles.css";

import { useEffect, useRef, useState } from "react";

import FuelStationPopup from "./FuelStationPopup";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import { useFuelStations } from "../../hooks/useFuelStations";

const FuelStationMarkerComponent = ({ station }) => {
  return (
    <div
      className="fuel-station-marker"
      style={{ borderColor: station.brand.color }}
    >
      <div
        className="fuel-station-marker-icon"
        style={{ backgroundColor: station.brand.color }}
      >
        <img
          src={station.brand.logo || "/images/fuel-station-default.svg"}
          alt={station.brand.name}
        />
      </div>
      <div className="fuel-station-marker-label">{station.brand.name}</div>
    </div>
  );
};

const FuelStationsMarkers = ({ map }) => {
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const [activeStation, setActiveStation] = useState(null);
  const {
    stations,
    fetchStations,
    clearStations,
    selectStation,
    clearSelectedStation,
    getFilteredStations,
    isLoading,
    error,
  } = useFuelStations();

  useEffect(() => {
    // Fetch fuel stations data when component mounts
    fetchStations();

    // Clean up when component unmounts
    return () => {
      clearStations();
    };
  }, []);

  useEffect(() => {
    if (!map || !stations?.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Get filtered stations
    const filteredStations = getFilteredStations();

    // Add new markers
    filteredStations.forEach((station) => {
      if (!station.lat || !station.lng) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "fuel-station-marker-container";

      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<FuelStationMarkerComponent station={station} />);

      // Create the marker and add it to the map
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat([station.lng, station.lat])
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
          <FuelStationPopup
            station={station}
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
          className: "fuel-station-popup",
        })
          .setLngLat([station.lng, station.lat])
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveStation(station);
        selectStation(station);
      });

      // Store marker reference for cleanup
      markersRef.current[station.id] = marker;
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, stations, getFilteredStations, selectStation]);

  return null; // This component doesn't render anything directly
};

export default FuelStationsMarkers;
