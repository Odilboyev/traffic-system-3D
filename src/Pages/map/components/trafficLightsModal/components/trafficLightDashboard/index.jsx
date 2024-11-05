import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { TbPencil } from "react-icons/tb";
import { getTrafficLightsConfig } from "../../../../../../api/api.handlers";
import useLocalStorageState from "../../../../../../customHooks/uselocalStorageState";
import { fixIncompleteJSON } from "../../../trafficLightMarkers/utils";
import ConfigPanel from "./components/configPanel";
import Intersection from "./components/intersection";

const TrafficLightDashboard = ({ id, isInModal }) => {
  const role = atob(localStorage.getItem("its_user_role"));
  const [showConfig, setShowConfig] = useState(false);
  const [incomingConfig, setIncomingConfig] = useState(null);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const defaultConfig = {
    angle: 45,
    north: {
      lanesLeft: [[], []],
      lanesRight: [
        { icon: "TbArrowBackUp", channel_id: 3 },
        { icon: "TbArrowUp", channel_id: 3 },
        { icon: "TbArrowUp", channel_id: 3 },
        { icon: "TbArrowRampRight", channel_id: 3 },
      ],
      visible: true,
      direction: "vertical",
      cross_walk: { channel_id: 15 },
    },
    south: {
      lanesLeft: [[], []],
      lanesRight: [
        { icon: "TbArrowBackUp", channel_id: 4 },
        { icon: "TbArrowUp", channel_id: 4 },
        { icon: "TbArrowRight", channel_id: 6 },
      ],
      visible: true,
      direction: "vertical",
      cross_walk: { channel_id: 16 },
    },
    east: {
      lanesLeft: [[], []],
      lanesRight: [
        { icon: "TbArrowBackUp", channel_id: 7 },
        { icon: "TbArrowUp", channel_id: 7 },
        { icon: "TbArrowRampRight", channel_id: 8 },
      ],
      visible: true,
      direction: "horizontal",
      cross_walk: { channel_id: 17 },
    },
    west: {
      lanesLeft: [[], []],
      lanesRight: [
        { icon: "TbArrowBackUp", channel_id: 9 },
        { icon: "TbArrowUp", channel_id: 9 },
        { icon: "TbArrowUp", channel_id: 9 },
        { icon: "TbArrowRampRight", channel_id: 10 },
      ],
      visible: true,
      direction: "horizontal",
      cross_walk: { channel_id: 18 },
    },
  };

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
    north: "green",
    south: "green",
    east: "red",
    west: "red",
  });

  const [seconds, setSeconds] = useState({});

  const [crosswalkSeconds, setCrosswalkSeconds] = useState({
    north: 30,
    south: 30,
    east: 30,
    west: 30,
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
    if (id && incomingConfig) {
      const connectWebSocket = () => {
        const socket = new WebSocket(
          `${import.meta.env.VITE_TRAFFIC_SOCKET}/${id}`
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
            if (data?.channel) {
              // Create a map of channel statuses
              const channelStatuses = data.channel.reduce((acc, channel) => {
                acc[channel.id] = {
                  status: channel.status,
                  countdown: channel.countdown,
                };
                return acc;
              }, {});

              // Update traffic lights and seconds for each direction
              setTrafficLights((prevState) => {
                const newState = { ...prevState };
                const newSeconds = {}; // Create an object to store seconds for each direction

                Object.entries(incomingConfig).forEach(
                  ([direction, dirConfig]) => {
                    if (direction !== "angle") {
                      // Handle right lanes
                      if (dirConfig.lanesRight.length > 0) {
                        // Get status from first lane for traffic light
                        const firstChannelId =
                          dirConfig.lanesRight[0].channel_id;
                        if (firstChannelId && channelStatuses[firstChannelId]) {
                          const status = channelStatuses[firstChannelId].status;
                          newState[direction] =
                            status === 1
                              ? "green"
                              : status === 9 || status === 3
                              ? "yellow"
                              : "red";
                        }

                        // Store countdown for each channel in the direction
                        newSeconds[direction] = {};
                        dirConfig.lanesRight.forEach((lane) => {
                          if (
                            lane.channel_id &&
                            channelStatuses[lane.channel_id]
                          ) {
                            newSeconds[direction][lane.channel_id] =
                              channelStatuses[lane.channel_id].countdown;
                          }
                        });
                      }

                      // Handle left lanes
                      if (dirConfig.lanesLeft.length > 0) {
                        dirConfig.lanesLeft.forEach((lane) => {
                          if (
                            lane.channel_id &&
                            channelStatuses[lane.channel_id]
                          ) {
                            if (!newSeconds[direction])
                              newSeconds[direction] = {};
                            newSeconds[direction][lane.channel_id] =
                              channelStatuses[lane.channel_id].countdown;
                          }
                        });
                      }
                    }
                  }
                );

                setSeconds(newSeconds); // Update seconds state
                return newState;
              });

              // Update crosswalks and their countdowns
              setCrosswalks((prevState) => {
                const newState = { ...prevState };
                Object.entries(config).forEach(([direction, dirConfig]) => {
                  if (direction !== "angle") {
                    const channelId = dirConfig.cross_walk?.channel_id;
                    if (channelId && channelStatuses[channelId]) {
                      const status = channelStatuses[channelId].status;
                      newState[direction] = status === 1 ? "green" : "red";
                    }
                  }
                });
                return newState;
              });

              // Update crosswalk seconds
              setCrosswalkSeconds((prevSeconds) => {
                const newSeconds = { ...prevSeconds };
                Object.entries(config).forEach(([direction, dirConfig]) => {
                  if (direction !== "angle") {
                    const channelId = dirConfig.cross_walk?.channel_id;
                    if (channelId && channelStatuses[channelId]) {
                      newSeconds[direction] =
                        channelStatuses[channelId].countdown;
                    }
                  }
                });
                return newSeconds;
              });
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

  // Remove the interval-based useEffect
  return (
    <div
      className={`relative h-[90vh] flex items-center justify-center overflow-hidden`}
    >
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
          {showConfig && <ConfigPanel config={config} setConfig={setConfig} />}
        </div>
      )}

      {(showConfig || incomingConfig) && (
        <Intersection
          id={id}
          isInModal={isInModal}
          config={config}
          trafficLights={trafficLights}
          crosswalks={crosswalks}
          seconds={seconds}
          crosswalkSeconds={crosswalkSeconds}
        />
      )}

      {incomingConfig && !showConfig && (
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
