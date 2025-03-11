import "./styles.css";

import { useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom/client";
import RoadSignPopup from "./RoadSignPopup";
import maplibregl from "maplibre-gl";
import { useRoadSigns } from "../../hooks/useRoadSigns";

// Placeholder SVG icons for road signs (in a real app, you would use actual images)
const roadSignIcons = {
  speed_limit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  stop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>`,
  yield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 19h20L12 2z"/></svg>`,
  no_entry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M5 12h14"/></svg>`,
  no_parking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
  no_overtaking: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 8l6 8"/><path d="M15 8l-6 8"/></svg>`,
  pedestrian_crossing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M12 11v8"/><path d="M8 15h8"/></svg>`,
  traffic_light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="17" r="2"/></svg>`,
  no_u_turn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h4v8"/><path d="M7 9a4 4 0 0 1 4-4h6"/><path d="M17 5l-4 4 4 4"/></svg>`,
};

const RoadSignMarkerComponent = ({ roadSign }) => {
  let iconHtml = roadSignIcons[roadSign.type] || roadSignIcons.stop;
  let label = roadSign.type === "speed_limit" ? `${roadSign.value}` : "";
  console.log(roadSign, "roadSign");
  return (
    <div className="road-sign-marker">
      <img
        className="road-sign-marker-icon"
        src={`/icons/signs/${roadSign.sings_data[0].roadsign_image_url}`}
        // alt={roadSign.location_id}
      />
      {/* {label && <div className="road-sign-marker-label">{label}</div>} */}
    </div>
  );
};

const RoadSignsMarkers = ({ map }) => {
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const [activeRoadSign, setActiveRoadSign] = useState(null);
  const {
    roadSignsData,
    fetchRoadSignsData,
    clearRoadSignsData,
    selectRoadSign,
    clearSelectedRoadSign,
    getFilteredRoadSigns,
    roadSignTypes,
    isLoading,
    error,
  } = useRoadSigns();

  useEffect(() => {
    map.on("moveend", () => {
      const center = map.getCenter();
      const zoom = Math.round(map.getZoom());
      zoom > 17 &&
        fetchRoadSignsData({ lat: center.lat, lng: center.lng, zoom });
    });
    // Fetch road signs data when component mounts
    // Clean up when component unmounts
    return () => {
      clearRoadSignsData();
    };
  }, []);

  useEffect(() => {
    if (!map || !roadSignsData.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};
    console.log(roadSignsData, "roadSignsData");
    // Add new markers
    roadSignsData.forEach((roadSign) => {
      console.log(roadSign, "roadSign");
      if (!roadSign.lat || !roadSign.lng) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "mrker-container";

      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<RoadSignMarkerComponent roadSign={roadSign} />);

      // Create the marker and add it to the map
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat([roadSign.lng, roadSign.lat])
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
          <RoadSignPopup
            roadSign={roadSign}
            roadSignType={roadSignTypes[roadSign.type]}
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
          className: "road-sign-popup",
        })
          .setLngLat([roadSign.lng, roadSign.lat])
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveRoadSign(roadSign);
        selectRoadSign(roadSign);
      });

      // Store marker reference for cleanup
      markersRef.current[roadSign.id] = marker;
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, roadSignsData, getFilteredRoadSigns, selectRoadSign, roadSignTypes]);

  return null; // This component doesn't render anything directly
};

export default RoadSignsMarkers;
