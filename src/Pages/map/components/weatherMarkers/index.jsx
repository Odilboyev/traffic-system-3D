import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";
import "./styles.css";
import WeatherPopup from "./WeatherPopup";
import { useWeather } from "../../hooks/useWeather";

const getWeatherIcon = (weatherCode) => {
  // Weather codes based on common API standards
  if (weatherCode >= 200 && weatherCode < 300) return WiThunderstorm;
  if (weatherCode >= 300 && weatherCode < 400) return WiRain;
  if (weatherCode >= 500 && weatherCode < 600) return WiRain;
  if (weatherCode >= 600 && weatherCode < 700) return WiSnow;
  if (weatherCode >= 700 && weatherCode < 800) return WiFog;
  if (weatherCode === 800) return WiDaySunny;
  if (weatherCode > 800) return WiCloudy;
  return WiDaySunny; // Default
};

const WeatherMarkerComponent = ({ data }) => {
  const { temp, weatherCode } = data;
  const Icon = getWeatherIcon(weatherCode);
  
  return (
    <div className="weather-marker">
      <div className="weather-marker-icon">
        <Icon />
      </div>
      <div className="weather-marker-temp">{Math.round(temp)}°C</div>
    </div>
  );
};

const WeatherMarkers = ({ map }) => {
  const markersRef = useRef({});
  const popupRef = useRef(null);
  const [activeStation, setActiveStation] = useState(null);
  const {
    weatherData,
    fetchWeatherData,
    clearWeatherData,
    isLoading,
    error
  } = useWeather();

  useEffect(() => {
    // Fetch weather data when component mounts
    fetchWeatherData();

    // Clean up when component unmounts
    return () => {
      clearWeatherData();
    };
  }, []);

  useEffect(() => {
    if (!map || !weatherData.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    weatherData.forEach((station) => {
      if (!station.lat || !station.lng) return;

      // Create a custom HTML element for the marker
      const markerElement = document.createElement("div");
      markerElement.className = "weather-marker-container";
      
      // Create a React root and render the marker component
      const root = ReactDOM.createRoot(markerElement);
      root.render(<WeatherMarkerComponent data={station} />);

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
        popupRoot.render(<WeatherPopup data={station} onClose={() => {
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        }} />);

        // Create and add popup to map
        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "top",
          offset: [0, -10],
          className: "weather-popup",
        })
          .setLngLat([station.lng, station.lat])
          .setDOMContent(popupElement)
          .addTo(map);

        popupRef.current = popup;
        setActiveStation(station);
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
  }, [map, weatherData]);

  return null; // This component doesn't render anything directly
};

export default WeatherMarkers;
