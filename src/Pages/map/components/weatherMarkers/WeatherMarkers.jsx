import { Marker, Popup } from "maplibre-gl";
import {
  WiCloudy,
  WiDaySunny,
  WiRain,
  WiSnow,
  WiStrongWind,
} from "react-icons/wi";
import { useEffect, useState } from "react";

import { FaExclamationTriangle } from "react-icons/fa";
import ReactDOM from "react-dom/client";

const WeatherMarkers = ({ map, markers }) => {
  const [weatherMarkers, setWeatherMarkers] = useState([]);
  const [activePopup, setActivePopup] = useState(null);

  // Create weather station marker element
  const createWeatherStationElement = (marker) => {
    const el = document.createElement("div");
    el.className = "weather-sation-marker";
    el.style.width = "40px";
    el.style.height = "40px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "rgba(0, 120, 255, 0.7)";
    el.style.border = "2px solid white";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.color = "white";
    el.style.fontSize = "20px";
    el.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

    // Create icon based on weather condition
    const iconContainer = document.createElement("div");
    const root = ReactDOM.createRoot(iconContainer);
    root.render(getWeatherIcon(marker.condition));
    el.appendChild(iconContainer);

    return el;
  };

  // Create weather alert marker element
  const createWeatherAlertElement = (marker) => {
    const el = document.createElement("div");
    el.className = "weather-alert-marker";
    el.style.width = "36px";
    el.style.height = "36px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = getAlertColor(marker.severity);
    el.style.border = "2px solid white";
    el.style.display = "flex";
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.color = "white";
    el.style.fontSize = "18px";
    el.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
    el.style.animation = "pulse 1.5s infinite";

    // Create alert icon
    const iconContainer = document.createElement("div");
    const root = ReactDOM.createRoot(iconContainer);
    root.render(<FaExclamationTriangle />);
    el.appendChild(iconContainer);

    // Add pulse animation style
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return el;
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "sunny":
        return <WiDaySunny />;
      case "cloudy":
        return <WiCloudy />;
      case "rain":
        return <WiRain />;
      case "snow":
        return <WiSnow />;
      case "strong_wind":
        return <WiStrongWind />;
      default:
        return <WiDaySunny />;
    }
  };

  // Get alert color based on severity
  const getAlertColor = (severity) => {
    switch (severity) {
      case "high":
        return "rgba(220, 38, 38, 0.8)"; // Red
      case "moderate":
        return "rgba(245, 158, 11, 0.8)"; // Orange
      case "low":
        return "rgba(234, 179, 8, 0.8)"; // Yellow
      default:
        return "rgba(234, 179, 8, 0.8)";
    }
  };

  // Create weather station popup content
  const createWeatherStationPopup = (marker) => {
    const popupNode = document.createElement("div");
    popupNode.className = "weather-station-popup";

    const root = ReactDOM.createRoot(popupNode);
    root.render(
      <div className="p-2 min-w-[200px]">
        <h3 className="text-lg font-semibold mb-1">{marker.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">{marker.temperature}°C</span>
          <div className="text-2xl">{getWeatherIcon(marker.condition)}</div>
        </div>
        <div className="text-sm text-gray-600">
          {marker.condition === "sunny"
            ? "Quyoshli"
            : marker.condition === "cloudy"
            ? "Bulutli"
            : marker.condition === "rain"
            ? "Yomg'irli"
            : marker.condition === "snow"
            ? "Qorli"
            : "Kuchli shamol"}
        </div>
      </div>
    );

    return popupNode;
  };

  // Create weather alert popup content
  const createWeatherAlertPopup = (marker) => {
    const popupNode = document.createElement("div");
    popupNode.className = "weather-alert-popup";

    const root = ReactDOM.createRoot(popupNode);
    root.render(
      <div className="p-2 min-w-[200px]">
        <div className="flex items-center mb-1">
          <FaExclamationTriangle className="text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">Ob-havo Ogohlantirishi</h3>
        </div>
        <div className="mb-2">
          <div className="font-medium">
            {marker.alertType === "strong_wind"
              ? "Kuchli shamol"
              : marker.alertType === "rain"
              ? "Yomg'ir"
              : marker.alertType === "snow"
              ? "Qor"
              : "Ogohlantirish"}
          </div>
          <div className="text-sm mt-1">
            Xavf darajasi:
            <span
              className={`ml-1 font-medium ${
                marker.severity === "high"
                  ? "text-red-500"
                  : marker.severity === "moderate"
                  ? "text-orange-500"
                  : "text-yellow-500"
              }`}
            >
              {marker.severity === "high"
                ? "Yuqori"
                : marker.severity === "moderate"
                ? "O'rta"
                : "Past"}
            </span>
          </div>
        </div>
      </div>
    );

    return popupNode;
  };

  // Add markers to map
  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;

    // Clear existing markers
    weatherMarkers.forEach((marker) => marker.remove());

    // Create new markers
    const newMarkers = markers.map((marker) => {
      // Create marker element based on type
      const el =
        marker.type === 6
          ? createWeatherStationElement(marker)
          : createWeatherAlertElement(marker);

      // Create popup content based on type
      const popupContent =
        marker.type === 6
          ? createWeatherStationPopup(marker)
          : createWeatherAlertPopup(marker);

      // Create popup
      const popup = new Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        className: "weather-popup",
      }).setDOMContent(popupContent);

      // Create marker
      const mapMarker = new Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      // Add click event
      el.addEventListener("click", () => {
        if (activePopup) {
          activePopup.remove();
        }
        mapMarker.setPopup(popup);
        popup.addTo(map);
        setActivePopup(popup);
      });

      return mapMarker;
    });

    setWeatherMarkers(newMarkers);

    // Cleanup
    return () => {
      newMarkers.forEach((marker) => marker.remove());
    };
  }, [map, markers]);

  return null;
};

export default WeatherMarkers;
