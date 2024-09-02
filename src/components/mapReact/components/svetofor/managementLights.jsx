import React, { useEffect, useState } from "react";
// import Svetoforlar from "./Svetoforlar"; // Adjust path as necessary
import PhasesDisplay from "../crossroad/components/phases";
import Svetoforlar from ".";
function fixIncompleteJSON(message) {
  // Check if message starts with "{" and doesn't end with "}"
  if (message.startsWith("{") && !message.endsWith("}")) {
    // Count opening and closing braces
    const openBracesCount = (message.match(/{/g) || []).length;
    const closeBracesCount = (message.match(/}/g) || []).length;

    // If there are more opening braces than closing braces, add the missing closing braces
    if (openBracesCount > closeBracesCount) {
      const missingBraces = openBracesCount - closeBracesCount;
      message += "}".repeat(missingBraces);
    }
  }

  return message;
}

const TrafficLightContainer = ({ isInModal }) => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [phase, setPhase] = useState([]);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [currentSvetoforId, setCurrentSvetoforId] = useState(null);
  const [wssLink, setWssLink] = useState(null);
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);

  useEffect(() => {
    if (wssLink) {
      const socket = new WebSocket(wssLink);

      socket.onmessage = (event) => {
        let message = event.data;

        // Fix incomplete JSON message
        message = fixIncompleteJSON(message);
        try {
          const data = JSON.parse(message);
          if (data) updateTrafficLights(data);
        } catch (error) {
          console.log("Raw data error:", event.data); // Log raw data
          console.error("Error parsing WebSocket data:", error);
        }
      };

      setTrafficSocket(socket);
      socket.onclose = (e) => {
        console.log(e, "WebSocket closed");
      };
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [wssLink]);

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
    setWssLink(null);
    setLastSuccessfulLocation(null);
  };

  // Add your `fetchTrafficLights` and other related functions here, using
  // setTrafficLights, setWssLink, setLastSuccessfulLocation, etc., as needed.

  return (
    <>
      <Svetoforlar
        trafficLights={trafficLights}
        setTrafficLights={setTrafficLights}
        setCurrentSvetoforId={setCurrentSvetoforId}
        setTrafficSocket={setTrafficSocket}
        setWssLink={setWssLink}
        wssLink={wssLink}
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
