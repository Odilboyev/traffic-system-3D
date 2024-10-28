import { useEffect, useState } from "react";
import ConfigPanel from "./components/configPanel";
import Intersection from "./components/intersection";
import useLocalStorageState from "../../../../customHooks/uselocalStorageState";
import { getTrafficLightsConfig } from "../../../../api/api.handlers";
import { TbPencil } from "react-icons/tb";
import { fixIncompleteJSON } from "../svetofor/utils";

const RoadDrawing = ({ id }) => {
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

  const [seconds, setSeconds] = useState({
    north: 30,
    south: 30,
    east: 30,
    west: 30,
  });

  const [crosswalkSeconds, setCrosswalkSeconds] = useState({
    north: 30,
    south: 30,
    east: 30,
    west: 30,
  });

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
      const socket = new WebSocket(
        `${import.meta.env.VITE_TRAFFIC_SOCKET}/${id}`
      );

      socket.onmessage = (event) => {
        let message = event.data;
        message = fixIncompleteJSON(message);

        try {
          const data = JSON.parse(message);
          if (data?.channel) {
            // Create a map of channel statuses for easier lookup
            const channelStatuses = data.channel.reduce((acc, channel) => {
              acc[channel.id] = {
                status: channel.status,
                countdown: channel.countdown,
              };
              return acc;
            }, {});

            // Update traffic lights and seconds based on channel IDs in config
            setTrafficLights((prevState) => {
              const newState = { ...prevState };
              Object.entries(incomingConfig).forEach(
                ([direction, dirConfig]) => {
                  if (
                    direction !== "angle" &&
                    dirConfig.lanesRight.length > 0
                  ) {
                    const channelId = dirConfig.lanesRight[0].channel_id;
                    if (channelId && channelStatuses[channelId]) {
                      const status = channelStatuses[channelId].status;
                      newState[direction] =
                        status === 0
                          ? "green"
                          : status === 1
                          ? "yellow"
                          : "red";
                    }
                  }
                }
              );
              return newState;
            });

            // Update seconds for each direction
            setSeconds((prevSeconds) => {
              const newSeconds = { ...prevSeconds };
              Object.entries(config).forEach(([direction, dirConfig]) => {
                if (direction !== "angle" && dirConfig.lanesRight.length > 0) {
                  const channelId = dirConfig.lanesRight[0].channel_id;
                  if (channelId && channelStatuses[channelId]) {
                    newSeconds[direction] =
                      channelStatuses[channelId].countdown;
                  }
                }
              });
              return newSeconds;
            });

            // Update crosswalks and their countdowns
            setCrosswalks((prevState) => {
              const newState = { ...prevState };
              Object.entries(config).forEach(([direction, dirConfig]) => {
                if (direction !== "angle") {
                  const channelId = dirConfig.cross_walk?.channel_id;
                  if (channelId && channelStatuses[channelId]) {
                    const status = channelStatuses[channelId].status;
                    newState[direction] =
                      status === 0 ? "green" : status === 1 ? "red" : "yellow";
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

      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [id, incomingConfig, config]);

  // Remove the interval-based useEffect
  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {(!incomingConfig || showConfig) && (
        <div className="max-w-[20vw] w-[20vw]">
          {!incomingConfig && (
            <div className="text-center mb-4">
              <div className="text-red-500 mb-2">
                No traffic light data found
              </div>
              {(role === "admin" || role === "boss") && (
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

export default RoadDrawing;
