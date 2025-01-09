import { useEffect, useState } from "react";
import PhasesDisplay from "../crossroad/components/phases";
import TrafficlightMarkers from ".";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "./utils";

const TrafficLightContainer = ({ isInModal, handleMarkerDragEnd }) => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [phase, setPhase] = useState([]);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [currentSvetoforId, setCurrentSvetoforId] = useState(null);
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentSvetoforId && !isPaused) {
      console.log("Creating new socket, paused:", isPaused);
      const socket = new WebSocket(
        `${
          import.meta.env.VITE_TRAFFICLIGHT_SOCKET
        }?svetofor_id=${currentSvetoforId}&token=${authToken}`
      );

      socket.onmessage = (event) => {
        let message = event.data;
        message = fixIncompleteJSON(message);
        try {
          const data = JSON.parse(message);
          if (data) updateTrafficLights(data);
        } catch (error) {
          throw new Error(error);
        }
      };

      setTrafficSocket(socket);
      socket.onclose = (e) => {
        // console.log(e, "WebSocket closed");
      };
      return () => {
        if (socket) {
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
    if (trafficSocket) {
      trafficSocket.close();
      setTrafficSocket(null);
    }
    setCurrentSvetoforId(null);
    setLastSuccessfulLocation(null);
  };

  return (
    <>
      <TrafficlightMarkers
        handleMarkerDragEnd={handleMarkerDragEnd}
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setTrafficSocket={setTrafficSocket}
        phase={phase}
        setPhase={setPhase}
        currentSvetoforId={currentSvetoforId}
        lastSuccessfulLocation={lastSuccessfulLocation}
        setLastSuccessfulLocation={setLastSuccessfulLocation}
        trafficSocket={trafficSocket}
        clearTrafficLights={clearTrafficLights}
        updateTrafficLights={updateTrafficLights}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
      {isInModal && phase?.length > 0 && <PhasesDisplay phases={phase} />}
    </>
  );
};

export default TrafficLightContainer;
