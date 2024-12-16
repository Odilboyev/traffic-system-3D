import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { Popup, Tooltip } from "react-leaflet";
import { memo, useEffect, useRef, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import { IconButton } from "@material-tailwind/react";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";
import TrafficLightCounter from "./components/TrafficLightCounter";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "../../components/trafficLightMarkers/utils";

const CameraDetails = memo(
  function CameraDetails({ marker = {}, t, isLoading, cameraData, isPTZ, L }) {
    const popupRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleCollapseToggle = () => {
      setIsCollapsed((prev) => !prev);
    };
    const [showToolTip, setShowToolTip] = useState(true);
    const [trafficLightSeconds, setTrafficLightSeconds] = useState(null);
    const [trafficLightSocket, setTrafficLightSocket] = useState(null);

    // WebSocket connection management
    const connectTrafficLightSocket = (svetoforId) => {
      // Prevent multiple connections for the same svetofor_id
      if (trafficLightSocket) {
        return trafficLightSocket;
      }

      const socket = new WebSocket(
        `${
          import.meta.env.VITE_TRAFFICLIGHT_SOCKET
        }?svetofor_id=${svetoforId}&token=${authToken}`
      );

      socket.onopen = () => {
        console.log(`WebSocket connected for svetofor_id: ${svetoforId}`);
      };

      socket.onclose = () => {
        console.log(`WebSocket closed for svetofor_id: ${svetoforId}`);
        setTrafficLightSocket(null);
      };

      socket.onmessage = (event) => {
        let message = event.data;
        message = fixIncompleteJSON(message);

        try {
          const data = JSON.parse(message);
          if (data?.channel) {
            const channelSeconds = data.channel.reduce((acc, channel) => {
              acc[channel.id] = {
                countdown: channel.countdown,
                status: channel.status,
              };
              return acc;
            }, {});
            setTrafficLightSeconds((prev) => {
              // Only update if the value has changed to prevent unnecessary re-renders
              const isChanged =
                JSON.stringify(prev) !== JSON.stringify(channelSeconds);
              return isChanged ? channelSeconds : prev;
            });
          }
        } catch (error) {
          console.error(
            "Error parsing traffic light WebSocket message:",
            error
          );
        }
      };

      setTrafficLightSocket(socket);
      return socket;
    };

    // Manage WebSocket connection based on marker type
    useEffect(() => {
      if (marker.type === 1 && marker.svetofor_id) {
        const socket = connectTrafficLightSocket(marker.svetofor_id);

        return () => {
          if (socket) {
            socket.close();
          }
        };
      }
    }, [marker.svetofor_id, marker.type]);

    const handleOpenLink = () => {
      const { ip, http_port } = cameraData;
      const url = `http://${ip}:${http_port}`;
      window.open(url, "_blank");
    };

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    return (
      <>
        <Popup
          eventHandlers={{
            mouseover: (e) => {
              const element = e.target.getElement();
              const draggable = new L.Draggable(element);
              draggable.enable();
            },
            popupopen: () => {
              setShowToolTip(false);
            },
            popupclose: () => {
              setShowToolTip(true);
            },
          }}
          ref={popupRef}
          maxWidth={"100%"}
          minHeight={"100%"}
          height={"100%"}
          interactive
          closeOnClick={false}
          autoClose={false}
          keepInView={false}
          autoPan={false}
          className="!p-0 !m-0 z-[50000000] custom-popup text-white"
        >
          {!isLoading && cameraData ? (
            <div className="rounded-xl bg-gray-900/60 backdrop-blur-md text-white ">
              {/* Header Section */}
              <div className="flex w-full gap-2">
                {" "}
                <IconButton
                  size="sm"
                  variant={"outlined"}
                  onClick={openModal}
                  className="text-white"
                >
                  <FaVideo />
                </IconButton>
                <IconButton
                  size="sm"
                  variant={"outlined"}
                  className="text-white"
                  onClick={handleCollapseToggle}
                >
                  {isCollapsed ? <FaPlus /> : <FaMinus />}
                </IconButton>
                <IconButton
                  size="sm"
                  variant={"outlined"}
                  className="text-white"
                  onClick={handleOpenLink}
                >
                  <FiExternalLink className="w-4 h-4" />
                </IconButton>
              </div>

              {/* Streams Section */}
              {cameraData?.streams?.length > 0 && (
                <Records videos={cameraData.streams} name={cameraData.name} />
              )}

              {/* Traffic Light Seconds Display */}
              {marker.type === 1 && trafficLightSeconds && marker.link_id && (
                <TrafficLightCounter
                  channelId={marker.link_id}
                  seconds={trafficLightSeconds[marker.link_id].countdown}
                  status={trafficLightSeconds[marker.link_id].status}
                  t={t}
                />
              )}

              {/* Collapsible Description */}
              {!isCollapsed && (
                <div className="text-sm bg-transparent backdrop-blur-md  rounded-b-xl p-2">
                  <p>
                    <strong>{t("Crossroad_Name")}: </strong>
                    {cameraData.crossroad_name}
                  </p>
                  <p>
                    <strong>{t("ip")}: </strong>
                    {cameraData.ip}
                  </p>
                </div>
              )}
            </div>
          ) : (
            t("loading")
          )}
        </Popup>
        {showToolTip && (
          <Tooltip direction="top" className="rounded-md">
            <div
              style={{
                minWidth: "8vw",
                minHeight: "6vw",
                overflow: "hidden",
              }}
            >
              {!isLoading ? (
                <>
                  {cameraData?.streams?.map((v, i) => (
                    <img
                      src={v.screenshot_url}
                      key={i}
                      className="w-full"
                      alt=""
                    />
                  ))}

                  <p className="my-0">{marker?.cname}</p>
                  {marker.statuserror === 2 && (
                    <p className=" text-center text-red-500">{t("offline")}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="my-0">{t("loading")}</p>
                </>
              )}
            </div>
          </Tooltip>
        )}
        <PTZCameraModal
          showController={isPTZ}
          isOpen={isModalOpen}
          onClose={closeModal}
          cameraData={cameraData}
        />
      </>
    );
  },
  // Modify the memo comparison to prevent re-renders for trafficLightSeconds changes
  (prevProps, nextProps) => {
    return (
      prevProps.marker.cid === nextProps.marker.cid &&
      prevProps.marker.type === nextProps.marker.type &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.cameraData === nextProps.cameraData
    );
  }
);

export default CameraDetails;
