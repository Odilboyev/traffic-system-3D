import { useEffect, useRef, useState } from "react";

import PhasesDisplay from "../crossroad/components/phases";
import TrafficlightMarkers from ".";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "./utils";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import { useMapContext } from "../../context/MapContext";

// Global socket tracking
let globalSocket = null;

const TrafficLightContainer = ({ handleMarkerDragEnd }) => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [phase, setPhase] = useState([]);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [currentSvetoforId, setCurrentSvetoforId] = useState(null);
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const socketTimeoutRef = useRef(null);

  const { map } = useMapContext();

  // Function to safely close global socket
  const closeGlobalSocket = () => {
    if (globalSocket) {
      console.log("Closing global socket for svetofor_id:", currentSvetoforId);
      globalSocket.onclose = null; // Remove onclose handler to prevent recursion
      globalSocket.close();
      globalSocket = null;
      setTrafficSocket(null);
      setPhase([]); // Clear phase data when socket closes

      // Clear any pending reconnection timeout
      if (socketTimeoutRef.current) {
        clearTimeout(socketTimeoutRef.current);
        socketTimeoutRef.current = null;
      }
    }
  };

  // Function to create new socket connection
  const createSocketConnection = (svetoforId) => {
    // Close existing socket before creating new one
    closeGlobalSocket();

    const wsBaseUrl =
      vendor === 1
        ? import.meta.env.VITE_TRAFFICLIGHT_SOCKET
        : import.meta.env.VITE_TRAFFICLIGHT_SOCKET.replace(
            "/websocket/",
            "/websocketfama/"
          );

    const wsUrl = `${wsBaseUrl}?svetofor_id=${svetoforId}&token=${authToken}`;
    console.log("Attempting WebSocket connection to:", wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Socket successfully connected for svetofor_id:", svetoforId);
      globalSocket = ws;
      setTrafficSocket(ws);
    };

    ws.onmessage = (event) => {
      if (isPaused) return;

      try {
        const fixedData = fixIncompleteJSON(event.data);
        const data = JSON.parse(fixedData);

        if (data.type === "phase") {
          setPhase(data.data);
        } else if (data.status && data.data) {
          // Handle traffic light status updates
          updateTrafficLights(data.data);
        }
      } catch (error) {
        console.error("Error parsing socket data:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      closeGlobalSocket();

      // Attempt to reconnect after error
      if (!isPaused && currentSvetoforId) {
        socketTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect socket...");
          createSocketConnection(currentSvetoforId);
        }, 5000);
      }
    };

    ws.onclose = () => {
      console.log("Socket closed for svetofor_id:", svetoforId);
      if (globalSocket === ws) {
        globalSocket = null;
        setTrafficSocket(null);
        setPhase([]); // Clear phase data when socket closes

        // Attempt to reconnect on unexpected closure
        if (!isPaused && currentSvetoforId) {
          socketTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect socket...");
            createSocketConnection(currentSvetoforId);
          }, 5000);
        }
      }
    };

    return ws;
  };

  // Handle svetofor_id changes
  useEffect(() => {
    console.log(
      "Effect triggered - currentSvetoforId:",
      currentSvetoforId,
      "vendor:",
      vendor,
      "isPaused:",
      isPaused
    );
    if (currentSvetoforId) {
      console.log("Proceeding with socket connection");
      createSocketConnection(currentSvetoforId);
    }

    if (!currentSvetoforId) {
      console.log("Skipping socket connection - conditions not met");
      closeGlobalSocket();
      return;
    }
  }, [currentSvetoforId, isPaused, vendor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeGlobalSocket();
    };
  }, []);

  // Handle svetofor_id changes
  useEffect(() => {
    if (!map) return;

    console.log("Map instance in TrafficLightContainer:", map);

    // Initial data fetch when map is ready
    const fetchInitialData = async () => {
      try {
        const center = map.getCenter();
        const response = await getNearbyTrafficLights({
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom(),
        });
        console.log("Initial traffic lights data:", response);
        if (response.data) {
          setTrafficLights(response.data);
        }
        setCurrentSvetoforId(response?.svetofor_id);
      } catch (error) {
        console.error("Error fetching initial traffic lights:", error);
      }
    };

    fetchInitialData();
  }, [map]);

  const updateTrafficLights = (data) => {
    if (!data || isPaused) return;

    // setTrafficLights((prevLights) => {
    //   return prevLights.map((light) => {
    //     const updatedLight = data.find(
    //       (d) => d.link_id === light.link_id
    //     );
    //     return updatedLight ? { ...light, ...updatedLight } : light;
    //   });
    // });
  };

  const clearTrafficLights = () => {
    setTrafficLights([]);
    closeGlobalSocket();
    setCurrentSvetoforId(null);
    setLastSuccessfulLocation(null);
  };

  return (
    <>
      {/* <TrafficlightMarkers
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setVendor={setVendor}
        currentSvetoforId={currentSvetoforId}
        clearTrafficLights={() => {
          setTrafficLights([]);
          closeGlobalSocket();
          setPhase([]);
        }}
        updateTrafficLights={(data) => {
          // Close existing socket before updating data
          if (data && data.length > 0) {
            closeGlobalSocket();
          }
          setTrafficLights(data);
        }}
        handleMarkerDragEnd={handleMarkerDragEnd}
        trafficSocket={trafficSocket}
        setTrafficSocket={setTrafficSocket}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        map={map}
      /> */}
      {map && phase?.length > 0 && <PhasesDisplay phases={phase} />}
    </>
  );
};

export default TrafficLightContainer;
