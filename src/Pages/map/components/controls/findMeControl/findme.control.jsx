import { FaLocationArrow, FaStopCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import Control from "../../../../../components/customControl";
import { IconButton } from "@material-tailwind/react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const FindMeControl = () => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const [isRealTimeTracking, setIsRealTimeTracking] = useState(false);
  const locationMarkerRef = useRef(null);
  const watchIdRef = useRef(null);

  const createLocationMarker = (latitude, longitude) => {
    // Remove existing marker if it exists
    if (locationMarkerRef.current) {
      map.removeLayer(locationMarkerRef.current);
    }

    // Create a custom marker
    const marker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            position: relative;
            width: 20px;
            height: 20px;
          " class="animate-pulse">
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 10px rgba(0,0,0,0.3);
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            " class="bg-blue-500"></div>
            <div style="
              position: absolute;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid #4CAF50;
              animation: pulse 2s infinite;
              opacity: 0.7;
            "></div>
          </div>
          
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    });

    // Add marker to the map and store reference
    marker.addTo(map);
    locationMarkerRef.current = marker;

    return marker;
  };

  const startRealTimeTracking = () => {
    if ("geolocation" in navigator) {
      setIsRealTimeTracking(true);
      setIsLocating(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Create or update marker
          const marker = createLocationMarker(latitude, longitude);

          // Center map on current location if real-time tracking is active
          map.setView([latitude, longitude], map.getZoom(), {
            animate: true,
            duration: 1,
          });
        },
        (error) => {
          console.error("Error tracking location:", error);
          stopRealTimeTracking();
          alert("Unable to track your location");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const stopRealTimeTracking = () => {
    // Stop watching position
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Reset states
    setIsRealTimeTracking(false);
    setIsLocating(false);

    // Remove marker if it exists
    if (locationMarkerRef.current) {
      map.removeLayer(locationMarkerRef.current);
      locationMarkerRef.current = null;
    }
  };

  const handleFindMe = () => {
    if (isRealTimeTracking) {
      stopRealTimeTracking();
    } else {
      startRealTimeTracking();
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopRealTimeTracking();
    };
  }, [map]);

  return (
    <Control position="topright">
      <IconButton
        onClick={handleFindMe}
        size="lg"
        className={`
          leaflet-control-find-me 
          bg-white 
          shadow-md 
          rounded-lg 
          p-2 
          hover:bg-gray-100 
          transition-all 
          duration-300
          dark:bg-gray-900
          dark:text-white
          dark:hover:bg-gray-800
        `}
        title={isRealTimeTracking ? "Stop Tracking" : "Find My Location"}
      >
        {isRealTimeTracking ? (
          <FaStopCircle className="text-xl text-red-500 animate-pulse" />
        ) : (
          <FaLocationArrow
            className={`
              text-xl 
              ${isLocating ? "animate-pulse" : ""}
              ${
                isLocating
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          />
        )}
      </IconButton>
    </Control>
  );
};

export default FindMeControl;
