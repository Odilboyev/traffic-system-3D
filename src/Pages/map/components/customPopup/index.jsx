import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { memo, useEffect, useRef, useState } from "react";

import CustomPopup from "./components/customPopup/CustomPopup";
import { FiExternalLink } from "react-icons/fi";
import { IconButton } from "@material-tailwind/react";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";
import { Tooltip } from "react-leaflet";
import TrafficLightCounter from "./components/TrafficLightCounter";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "../../components/trafficLightMarkers/utils";
import { updateTrafficLightSeconds } from "../../../../redux/slices/trafficLightSecondsSlice";
import { useDispatch } from "react-redux";

const CameraDetails = memo(
  function CameraDetails({ marker = {}, t, isLoading, cameraData, isPTZ, L }) {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isPopupDraggable, setIsPopupDraggable] = useState(true);

    const handleCollapseToggle = () => {
      setIsCollapsed((prev) => !prev);
      setIsPopupDraggable((prev) => !prev);
    };
    const [showToolTip, setShowToolTip] = useState(true);

    // Store the latest traffic light seconds in a ref
    const trafficLightSecondsRef = useRef(null);
    const [trafficLightSocket, setTrafficLightSocket] = useState(null);

    // Manage WebSocket connection based on marker type
    useEffect(() => {
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

              // Update ref immediately
              trafficLightSecondsRef.current = channelSeconds;

              // Dispatch action to update Redux store
              dispatch(
                updateTrafficLightSeconds({
                  camera_id: marker.link_id,
                  countdown: channelSeconds[marker.link_id].countdown,
                  status: channelSeconds[marker.link_id].status,
                })
              );
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
      if (marker.type === 1 && marker.svetofor_id) {
        const socket = connectTrafficLightSocket(marker.svetofor_id);

        return () => {
          if (socket) {
            socket.close();
          }
        };
      }
    }, [marker.svetofor_id, marker.type, marker.link_id]);

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
        <CustomPopup
          isDraggable={isPopupDraggable}
          setShowToolTip={setShowToolTip}
        >
          {!isLoading && cameraData ? (
            <div className="rounded-lg bg-gray-200/30 dark:bg-gray-900/60 backdrop-blur-md ">
              <Records videos={cameraData?.streams} name={cameraData.name} />
              {/* Traffic Light Seconds Display */}

              {/* Header Section */}
              <div className="flex w-full justify-between gap-2 items-center px-4">
                {" "}
                <div className="flex gap-2 mx-auto py-2">
                  <IconButton
                    size="sm"
                    variant={"outlined"}
                    onClick={openModal}
                    className="dark:text-white"
                  >
                    <FaVideo />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant={"outlined"}
                    className="dark:text-white"
                    onClick={handleCollapseToggle}
                  >
                    {isCollapsed ? <FaPlus /> : <FaMinus />}
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant={"outlined"}
                    className="dark:text-white"
                    onClick={handleOpenLink}
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </IconButton>
                </div>
                {marker.type === 1 && marker.link_id && (
                  <div className="w-full p-2 ">
                    <TrafficLightCounter channelId={marker.link_id} />
                  </div>
                )}
              </div>

              {/* Collapsible Description */}
              {!isCollapsed && (
                <div className="text-sm flex flex-col border-t gap-4 bg-transparent backdrop-blur-md p-4 dark:text-white  rounded-b-xl">
                  <div>
                    <strong>{t("Crossroad_Name")}: </strong>
                    {cameraData.crossroad_name}
                  </div>
                  <div>
                    <strong>{t("ip")}: </strong>
                    {cameraData.ip}
                  </div>
                </div>
              )}
            </div>
          ) : (
            t("loading")
          )}
        </CustomPopup>
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
  // Prevent re-renders for minor changes
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
