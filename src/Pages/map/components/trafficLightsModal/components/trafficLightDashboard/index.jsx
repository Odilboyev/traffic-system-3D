import { defaultConfig, updateTrafficStates } from "./utils";
import { useEffect, useState } from "react";

import ConfigPanel from "./components/configPanel";
import InfoBarTrafficDash from "./components/infoBar";
import Intersection from "./components/intersection";
import PropTypes from "prop-types";
import { TbPencil } from "react-icons/tb";
import { authToken } from "../../../../../../api/api.config";
import { fixIncompleteJSON } from "../../../trafficLightMarkers/utils";
import { getTrafficLightsConfig } from "../../../../../../api/api.handlers";
import useLocalStorageState from "../../../../../../customHooks/uselocalStorageState";

const TrafficLightDashboard = ({
  id,
  vendor,
  markerData,
  isInModal = false,
  onClose,
}) => {
  const role = atob(localStorage.getItem("its_user_role"));
  const [showConfig, setShowConfig] = useState(false);
  const [incomingConfig, setIncomingConfig] = useState(null);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [phases, setPhases] = useState([]);
  const [config, setConfig] = useLocalStorageState(
    "its_roadDrawingConfig",
    incomingConfig || defaultConfig
  );
  const [trafficLights, setTrafficLights] = useState({
    north: "red",
    south: "red",
    east: "green",
    west: "green",
  });

  const [crosswalks, setCrosswalks] = useState({
    north: { left: "green", right: "green" },
    south: { left: "green", right: "green" },
    east: { left: "red", right: "red" },
    west: { left: "red", right: "red" },
  });

  const [seconds, setSeconds] = useState({});

  const [crosswalkSeconds, setCrosswalkSeconds] = useState({
    north: { left: 30, right: 30 },
    south: { left: 30, right: 30 },
    east: { left: 30, right: 30 },
    west: { left: 30, right: 30 },
  });

  const [wsConnectionStatus, setWsConnectionStatus] = useState("disconnected");
  const [lastMessageTime, setLastMessageTime] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getTrafficLightsConfig(id);
        if (data) {
          setIncomingConfig(data);
          setConfig(data);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (id && incomingConfig && vendor == 1) {
      const connectWebSocket = () => {
        const socket = new WebSocket(
          `${
            import.meta.env.VITE_TRAFFICLIGHT_SOCKET
          }?svetofor_id=${id}&token=${authToken}`
        );

        socket.onopen = () => {
          setWsConnectionStatus("connected");
          console.log("WebSocket connected");
        };

        socket.onclose = () => {
          setWsConnectionStatus("disconnected");
          console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setWsConnectionStatus("error");
        };

        socket.onmessage = (event) => {
          setLastMessageTime(Date.now());
          let message = event.data;
          message = fixIncompleteJSON(message);

          try {
            const data = JSON.parse(message);
            setPhases(data.phase);
            if (data?.channel) {
              const channelStatuses = data.channel.reduce((acc, channel) => {
                acc[channel.id] = {
                  status: channel.status,
                  countdown: channel.countdown,
                };
                return acc;
              }, {});

              const {
                newTrafficLights,
                newSeconds,
                newCrosswalks,
                newCrosswalkSeconds,
              } = updateTrafficStates(incomingConfig, channelStatuses);

              setTrafficLights(newTrafficLights);
              setSeconds(newSeconds);
              setCrosswalks(newCrosswalks);
              setCrosswalkSeconds(newCrosswalkSeconds);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        setTrafficSocket(socket);
        return socket;
      };

      const socket = connectWebSocket();

      // Check for stale connection every 10 seconds
      const intervalId = setInterval(() => {
        if (lastMessageTime && Date.now() - lastMessageTime > 10000) {
          console.log("No messages received recently, reconnecting...");
          socket.close();
        }
      }, 10000);

      // Cleanup function
      return () => {
        console.log("Cleaning up WebSocket connection");
        clearInterval(intervalId);
        if (socket) {
          socket.close();
          setTrafficSocket(null);
        }
      };
    }
  }, [id, incomingConfig]);
  const info = {
    name: markerData?.cname,
    crossroad_id: "12345",
    IP: "192.168.1.1",
    status: "Active",
    traffic_volume: "High",
  };

  // Remove the interval-based useEffect
  return (
    <div className={` no-scrollbar relative h-full flex items-center justify-`}>
      {wsConnectionStatus !== "connected" && incomingConfig && (
        <div className="absolute top-4 right-4 px-4 py-2 rounded-md text-white bg-red-500">
          {wsConnectionStatus === "disconnected"
            ? "Disconnected - Reconnecting..."
            : "Connection Error"}
        </div>
      )}
      {(!incomingConfig || showConfig) && (
        <div className="max-w-[20vw] w-[20vw]">
          {!incomingConfig && (
            <div className="text-center mb-4">
              <div className="text-red-500 mb-2">
                No traffic light data found
              </div>
              {(role === "admin" || role === "boss") && !isInModal && (
                <button
                  onClick={() => setShowConfig(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Create New Configuration
                </button>
              )}
            </div>
          )}
          {showConfig && (
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              id={id}
              handleCLose={() => setShowConfig(false)}
            />
          )}
        </div>
      )}

      {(showConfig || incomingConfig) && (
        <Intersection
          id={id}
          // isInModal={false}
          config={config}
          trafficLights={trafficLights}
          crosswalks={crosswalks}
          seconds={seconds}
          crosswalkSeconds={crosswalkSeconds}
        />
      )}
      <InfoBarTrafficDash
        info={info}
        phase={phases}
        config={config}
        onClose={onClose}
      />

      {incomingConfig && !showConfig && !isInModal && (
        <button
          onClick={() => setShowConfig(true)}
          className="absolute bottom-4 left-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
        >
          <TbPencil size={24} />
        </button>
      )}
    </div>
  );
};

TrafficLightDashboard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isInModal: PropTypes.bool,
};

export default TrafficLightDashboard;
