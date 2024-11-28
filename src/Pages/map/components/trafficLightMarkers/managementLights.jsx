import { useEffect, useState } from "react";

import PhasesDisplay from "../crossroad/components/phases";
// import Svetoforlar from "./Svetoforlar"; // Adjust path as necessary
import TrafficlightMarkers from ".";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "./utils";

const TrafficLightContainer = ({ isInModal }) => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [phase, setPhase] = useState([]);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [currentSvetoforId, setCurrentSvetoforId] = useState(null);
  const [svetofor_id, setSvetofor_id] = useState(null);
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(
      `${
        import.meta.env.VITE_TRAFFICLIGHT_SOCKET
      }?svetofor_id=${svetofor_id}&token=${authToken}`
    );

    socket.onmessage = (event) => {
      let message = event.data;

      // Fix incomplete JSON message
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
  }, [svetofor_id]);

  const updateTrafficLights = (data) => {
    if (data) {
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
    setSvetofor_id(null);
    setLastSuccessfulLocation(null);
  };

  // Add your `fetchTrafficLights` and other related functions here, using
  // setTrafficLights, setWssLink, setLastSuccessfulLocation, etc., as needed.

  return (
    <>
      <TrafficlightMarkers
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setTrafficSocket={setTrafficSocket}
        setSvetofor_id={setSvetofor_id}
        phase={phase}
        setPhase={setPhase}
        currentSvetoforId={currentSvetoforId}
        lastSuccessfulLocation={lastSuccessfulLocation}
        setLastSuccessfulLocation={setLastSuccessfulLocation}
        trafficSocket={trafficSocket}
        clearTrafficLights={clearTrafficLights}
        updateTrafficLights={updateTrafficLights}
      />
      {isInModal && phase?.length > 0 && <PhasesDisplay phases={phase} />}
    </>
  );
};

export default TrafficLightContainer;
