import { useCallback, useEffect, useRef, useState } from "react";

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
  const ZOOM_THRESHOLD = 20;
  const socketTimeoutRef = useRef(null);

  const { map } = useMapContext();

  // Function to safely close global socket
  const closeGlobalSocket = (isZoomBased = false) => {
    if (globalSocket) {
      const reason = isZoomBased
        ? "zoom level below threshold"
        : "manual close";
      console.log(
        `Closing global socket for svetofor_id: ${currentSvetoforId} (${reason})`
      );
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

  const createSocketConnection = useCallback(
    (svetoforId) => {
      // Close existing socket before creating new one
      closeGlobalSocket();
      console.log(vendor, "vendor");
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
        console.log(
          "Socket successfully connected for svetofor_id:",
          svetoforId
        );
        globalSocket = ws;
        setTrafficSocket(ws);
      };

      ws.onmessage = (event) => {
        if (isPaused) return;

        try {
          const fixedData = fixIncompleteJSON(event.data);
          const data = JSON.parse(fixedData);
          // Handle traffic light status updates
          console.log(data, "data");
          updateTrafficLights(data);
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
    },
    [currentSvetoforId, vendor, isPaused]
  );

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
        setVendor(response?.vendor_id || 1);
      } catch (error) {
        console.error("Error fetching initial traffic lights:", error);
      }
    };

    fetchInitialData();
  }, [map]);

  const updateTrafficLights = useCallback(
    (data) => {
      if (!data?.channel || isPaused) return;

      const updatedLights = trafficLights.map((light) => {
        // Try matching by both id and link_id
        const update = data.channel.find(
          (v) => v.id === light.id || v.id === light.link_id
        );

        return {
          ...light,
          status: update.type === 100 ? light.status : update.status,
          countdown: update.countdown || light.countdown,
        };
      });

      // if (data.phase) {
      //   setPhase(data.phase);
      // }

      setTrafficLights(updatedLights);
    },
    [isPaused, trafficLights]
  );

  // Effect to handle socket connection when currentSvetoforId changes
  useEffect(() => {
    if (currentSvetoforId && !isPaused) {
      createSocketConnection(currentSvetoforId);
    } else {
      closeGlobalSocket();
    }
  }, [currentSvetoforId, vendor, isPaused]);
  console.log(trafficLights, "trafficLights");
  return (
    <>
      <TrafficlightMarkers
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setVendor={setVendor}
        currentSvetoforId={currentSvetoforId}
        handleMarkerDragEnd={handleMarkerDragEnd}
        trafficSocket={trafficSocket}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        map={map}
      />
      {/* {map && phase?.length > 0 && <PhasesDisplay phases={phase} />} */}
    </>
  );
};

export default TrafficLightContainer;
