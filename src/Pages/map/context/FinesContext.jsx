import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import login from "../../../Auth";
import { useMapContext } from "./MapContext";

// Create a context for fines
const FinesContext = createContext();

export const FinesProvider = ({ children }) => {
  const [fines, setFines] = useState([]);
  const [showFinesPanel, setShowFinesPanel] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [socketStatus, setSocketStatus] = useState("disconnected"); // 'connecting', 'connected', 'error', 'disconnected'
  const { map } = useMapContext();

  // Limit the number of fines to 8
  useEffect(() => {
    if (fines.length > 8) {
      // Keep only the 8 most recent fines (which are at the top of the list)
      setFines((prevFines) => prevFines.slice(0, 8));
    }
  }, [fines]);

  // WebSocket connection for real-time fines
  useEffect(() => {
    if (!map) return;

    // Check if zoom level is greater than 10 to show the panel
    const handleZoomChange = () => {
      const currentZoom = map.getZoom();
      setShowFinesPanel(currentZoom > 10);
    };

    // Initial check
    handleZoomChange();

    // Add zoom change listener
    map.on("zoom", handleZoomChange);

    // Get token from localStorage or use a default one

    const socketUrl = `${import.meta.env.VITE_FINES_SOCKET}?token=${
      login.token
    }`;

    console.log("Connecting to WebSocket:", socketUrl);
    setSocketStatus("connecting");

    // Create WebSocket connection
    let socket;
    try {
      socket = new WebSocket(socketUrl);
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setSocketStatus("error");
      return;
    }

    // Connection timeout handling
    const connectionTimeout = setTimeout(() => {
      if (socketStatus === "connecting") {
        console.error("WebSocket connection timeout");
        setSocketStatus("error");
        socket.close();
      }
    }, 10000); // 10 seconds timeout

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setSocketStatus("connected");
      clearTimeout(connectionTimeout);
    };

    socket.onmessage = (event) => {
      if (map.getZoom() > 10) {
        try {
          const data = JSON.parse(event.data);
          console.log("Received fine data:", data);

          // Extract location from crossroad
          let location = [69.2, 41.3]; // Default location if parsing fails
          try {
            if (data.crossroad && data.crossroad.location) {
              const locationObj = JSON.parse(data.crossroad.location);
              location = [
                parseFloat(locationObj.lng),
                parseFloat(locationObj.lat),
              ];
            }
          } catch (err) {
            console.error("Error parsing location:", err);
          }

          // Create fine object from WebSocket data
          const newFine = {
            id: Date.now().toString(),
            location: location,
            timestamp: data.created_at || new Date().toISOString(),
            type: data.violation_type,
            vehicleInfo: {
              plate: data.carnum || "Unknown",
              model: "Unknown",
              color: "Unknown",
            },
            crossroad: data.crossroad
              ? data.crossroad.name
              : "Unknown Location",
            speed: data.speed || "0",
            photos: data.photos || [],
            // Use the first photo if available, otherwise use sample image
            imagePath:
              data.photos && data.photos.length > 0 && data.photos[0].link
                ? data.photos[0].link
                : "/src/assets/images/sampleFine.png",
          };

          // Add new fines at the top of the list and limit to 8
          setFines((prevFines) => {
            const updatedFines = [newFine, ...prevFines];
            // If we have more than 8 fines, remove the oldest one
            return updatedFines.slice(0, 8);
          });
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setSocketStatus("error");

      // Fallback to mock data if WebSocket fails
      console.log("Falling back to mock data generation");
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      setSocketStatus("disconnected");
      clearTimeout(connectionTimeout);

      // Attempt to reconnect after a delay if not closed intentionally
      if (event.code !== 1000) {
        console.log("Attempting to reconnect in 5 seconds...");
        setTimeout(() => {
          // The useEffect will run again and attempt to reconnect
          if (map) {
            setSocketStatus("connecting");
          }
        }, 5000);
      }
    };

    return () => {
      socket.close();
      map.off("zoom", handleZoomChange);
    };
  }, [map]);

  // Function to fly to a fine's location
  const flyToFine = useCallback(
    (fine) => {
      if (!map || !fine) return;
      console.log(fine);
      map.flyTo({
        center: fine.location,
        zoom: 16,
        essential: true,
      });

      setSelectedFine(fine);
    },
    [map]
  );

  // Function to clear selected fine
  const clearSelectedFine = useCallback(() => {
    setSelectedFine(null);
  }, []);

  return (
    <FinesContext.Provider
      value={{
        fines,
        showFinesPanel,
        selectedFine,
        socketStatus,
        flyToFine,
        clearSelectedFine,
      }}
    >
      {children}
    </FinesContext.Provider>
  );
};

export const useFines = () => {
  const context = useContext(FinesContext);
  if (!context) {
    throw new Error("useFines must be used within a FinesProvider");
  }
  return context;
};
