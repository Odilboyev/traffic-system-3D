import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import { MdVideocam, MdSensors } from "react-icons/md";
import "./styles.css";
import MonitoringPopup from "./MonitoringPopup";
import { useMonitoring } from "../../hooks/useMonitoring";

const getDeviceIcon = (type) => {
  switch (type) {
    case "camera":
      return MdVideocam;
    case "sensor":
      return MdSensors;
    default:
      return MdVideocam;
  }
};

const getCongestionColor = (level) => {
  switch (level) {
    case "low":
      return "#10b981"; // green
    case "medium":
      return "#f59e0b"; // amber
    case "high":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray for unknown
  }
};

const MonitoringMarkerComponent = ({ device }) => {
  const Icon = getDeviceIcon(device.type);
  const congestionColor = getCongestionColor(device.metrics.congestionLevel);
  
  return (
    <div className="monitoring-marker-container">
      <div className={`monitoring-marker ${device.status !== 'active' ? 'monitoring-marker-inactive' : ''}`}>
        <div className="monitoring-marker-icon" style={{ backgroundColor: congestionColor }}>
          <Icon />
        </div>
        <div className="monitoring-marker-name">{device.name}</div>
      </div>
    </div>
  );
};

const MonitoringMarkers = ({ map }) => {
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const [activeDevice, setActiveDevice] = useState(null);
  const {
    monitoringData,
    fetchMonitoringData,
    clearMonitoringData,
    selectDevice,
    clearSelectedDevice,
    getFilteredDevices,
    isLoading,
    error
  } = useMonitoring();

  useEffect(() => {
    // Fetch monitoring data when component mounts
    fetchMonitoringData();

    // Clean up when component unmounts
    return () => {
      clearMonitoringData();
    };
  }, []);

  useEffect(() => {
    if (!map || !monitoringData.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Get filtered devices
    const filteredDevices = getFilteredDevices();

    // Add new markers
    filteredDevices.forEach((device) => {
      if (!device.location.lat || !device.location.lng) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      
      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<MonitoringMarkerComponent device={device} />);

      // Create the marker and add it to the map
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat([device.location.lng, device.location.lat])
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
          <MonitoringPopup 
            device={device} 
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
          className: "monitoring-popup",
        })
          .setLngLat([device.location.lng, device.location.lat])
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveDevice(device);
        selectDevice(device);
      });

      // Store marker reference for cleanup
      markersRef.current[device.id] = marker;
    });

    // Cleanup function
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, monitoringData, getFilteredDevices, selectDevice]);

  return null; // This component doesn't render anything directly
};

export default MonitoringMarkers;
