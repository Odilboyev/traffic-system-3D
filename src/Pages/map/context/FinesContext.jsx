import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getFineLastData } from "../../../api/api.handlers";
import login from "../../../Auth";
import { useMapContext } from "./MapContext";

// Create a context for fines
const FinesContext = createContext();

export const FinesProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fines, setFines] = useState([]);
  const [showFinesPanel, setShowFinesPanel] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [socketStatus, setSocketStatus] = useState("disconnected"); // 'connecting', 'connected', 'error', 'disconnected'
  const { map } = useMapContext();

  // Fetch fines data
  const fetchFinesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      const response = await getFineLastData();

      setFines(
        response.slice(0, 15).map((v) => ({
          ...v,
          location: JSON.parse(v.crossroad.location),
        }))
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching fines data:", err);
      setError("Failed to fetch fines data");
      setIsLoading(false);
    }
  }, []);
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

          // Process fine object from WebSocket data
          const newFine = {
            ...data,
            location: data.crossroad
              ? JSON.parse(data.crossroad.location)
              : null,
          };

          setFines((prevFines) => {
            // Replace a random fine when we have 15 or more
            const randomIndex = Math.floor(Math.random() * prevFines.length);
            const updatedFines = [...prevFines];
            updatedFines[randomIndex] = newFine;
            return updatedFines;
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
        setFines,
        fetchFinesData,
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
