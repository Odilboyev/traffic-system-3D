import { useEffect, useRef, useState } from "react";

import PhasesDisplay from "../crossroad/components/phases";
import TrafficlightMarkers from ".";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "./utils";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import { useMapContext } from "../../context/MapContext";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";

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

  const { map } = useMapContext();

  // Function to safely close global socket
  const closeGlobalSocket = () => {
    if (globalSocket) {
      console.log("Closing global socket for svetofor_id:", currentSvetoforId);
      globalSocket.close();
      globalSocket = null;
      setTrafficSocket(null);
    }
  };

  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      closeGlobalSocket();
    };
  }, []);

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
      } catch (error) {
        console.error("Error fetching initial traffic lights:", error);
      }
    };

    fetchInitialData();
  }, [map]);

  useEffect(() => {
    if (currentSvetoforId && !isPaused) {
      // Always close existing global socket first
      closeGlobalSocket();
      console.log(vendor, "vendor");
      const wsBaseUrl =
        vendor == 1
          ? import.meta.env.VITE_TRAFFICLIGHT_SOCKET
          : import.meta.env.VITE_TRAFFICLIGHT_SOCKET.replace(
              "/websocket/",
              "/websocketfama/"
            );
      console.log(wsBaseUrl);

      const socket = new WebSocket(
        `${wsBaseUrl}?svetofor_id=${currentSvetoforId}&token=${authToken}`
      );

      // Set as global socket
      globalSocket = socket;

      socket.onopen = () => {
        // Only set if this is still the global socket
        if (socket === globalSocket) {
          console.log("Socket connected for svetofor_id:", currentSvetoforId);
          setTrafficSocket(socket);
        } else {
          // If no longer the global socket, close it
          socket.close();
        }
      };

      socket.onmessage = (event) => {
        // Only process messages if this is still the global socket
        if (socket === globalSocket) {
          let message = event.data;
          message = fixIncompleteJSON(message);
          try {
            const data = JSON.parse(message);
            if (data) updateTrafficLights(data);
          } catch (error) {
            console.error("Socket message error:", error);
          }
        } else {
          // If no longer the global socket, close it
          socket.close();
        }
      };

      socket.onclose = (e) => {
        console.log(
          "WebSocket closed for svetofor_id:",
          currentSvetoforId,
          e.code,
          e.reason
        );
        if (socket === globalSocket) {
          globalSocket = null;
          setTrafficSocket(null);
        }
      };

      socket.onerror = (error) => {
        console.error(
          "WebSocket error for svetofor_id:",
          currentSvetoforId,
          error
        );
        if (socket === globalSocket) {
          closeGlobalSocket();
        }
      };

      return () => {
        if (socket === globalSocket) {
          closeGlobalSocket();
        } else {
          // Clean up this socket if it's not the global one
          socket.close();
        }
      };
    }
  }, [currentSvetoforId, isPaused]);

  const updateTrafficLights = (data) => {
    if (data && !isPaused) {
      const updatedLights = trafficLights.map((light) => {
        const update = data.channel.find((v) => v.id === light.link_id);
        return update
          ? {
              ...light,
              status: update.type === 100 ? light.status : update.status,
              countdown: update.countdown,
            }
          : light;
      });
      setPhase(data.phase);
      setTrafficLights(updatedLights);
    }
  };

  const clearTrafficLights = () => {
    setTrafficLights([]);
    closeGlobalSocket();
    setCurrentSvetoforId(null);
    setLastSuccessfulLocation(null);
  };

  return (
    <>
      <TrafficlightMarkers
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setVendor={setVendor}
        setTrafficSocket={setTrafficSocket}
        currentSvetoforId={currentSvetoforId}
        clearTrafficLights={() => {
          setTrafficLights([]);
          closeGlobalSocket();
        }}
        updateTrafficLights={(data) => setTrafficLights(data)}
        handleMarkerDragEnd={handleMarkerDragEnd}
        trafficSocket={trafficSocket}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        map={map}
      />
      {map && phase?.length > 0 && <PhasesDisplay phases={phase} />}
    </>
  );
};

export default TrafficLightContainer;
