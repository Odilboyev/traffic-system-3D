import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import { MdSpeed, MdTraffic, MdAirlineSeatReclineNormal, MdLayers, MdLocalParking } from "react-icons/md";
import "./styles.css";
import FinePopup from "./FinePopup";
import { useFines } from "../../hooks/useFines";

const getFineIcon = (type) => {
  switch (type) {
    case "speeding":
      return MdSpeed;
    case "red_light":
      return MdTraffic;
    case "no_seatbelt":
      return MdAirlineSeatReclineNormal;
    case "wrong_lane":
      return MdLayers;
    case "parking":
      return MdLocalParking;
    default:
      return MdSpeed;
  }
};

const getFineColor = (type) => {
  switch (type) {
    case "speeding":
      return "#ef4444"; // red
    case "red_light":
      return "#f97316"; // orange
    case "no_seatbelt":
      return "#eab308"; // yellow
    case "wrong_lane":
      return "#3b82f6"; // blue
    case "parking":
      return "#8b5cf6"; // purple
    default:
      return "#ef4444";
  }
};

const FineMarkerComponent = ({ fine }) => {
  const Icon = getFineIcon(fine.type);
  const color = getFineColor(fine.type);
  
  return (
    <div className="fine-marker" style={{ borderColor: color }}>
      <div className="fine-marker-icon" style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className="fine-marker-pulse" style={{ borderColor: color }}></div>
    </div>
  );
};

const FinesMarkers = ({ map }) => {
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const [activeFine, setActiveFine] = useState(null);
  const {
    finesData,
    fetchFinesData,
    clearFinesData,
    selectFine,
    clearSelectedFine,
    getFilteredFines,
    isLoading,
    error
  } = useFines();

  useEffect(() => {
    // Fetch fines data when component mounts
    fetchFinesData();

    // Clean up when component unmounts
    return () => {
      clearFinesData();
    };
  }, []);

  useEffect(() => {
    if (!map || !finesData.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Get filtered fines
    const filteredFines = getFilteredFines();

    // Add new markers
    filteredFines.forEach((fine) => {
      if (!fine.location.lat || !fine.location.lng) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "fine-marker-container";
      
      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<FineMarkerComponent fine={fine} />);

      // Create the marker and add it to the map
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat([fine.location.lng, fine.location.lat])
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
          <FinePopup 
            fine={fine} 
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
          className: "fine-popup",
        })
          .setLngLat([fine.location.lng, fine.location.lat])
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveFine(fine);
        selectFine(fine);
      });

      // Store marker reference for cleanup
      markersRef.current[fine.id] = marker;
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, finesData, getFilteredFines, selectFine]);

  return null; // This component doesn't render anything directly
};

export default FinesMarkers;
