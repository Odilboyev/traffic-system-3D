import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { memo, useEffect, useRef, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import { IconButton } from "@material-tailwind/react";
import MapLibrePopup from "./components/customPopup/MapLibrePopup";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";
import TrafficLightCounter from "./components/TrafficLightCounter";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "../../components/trafficLightMarkers/utils";
import { updateTrafficLightSeconds } from "../../../../redux/slices/trafficLightSecondsSlice";
import { useDispatch } from "react-redux";

const MapLibreCameraDetails = memo(function MapLibreCameraDetails({
  marker = {},
  t,
  isLoading,
  cameraData,
  isPTZ,
  map,
}) {
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupDraggable] = useState(true); // Always keep popup draggable
  // Always show popup when the component is rendered
  const [showPopup] = useState(true);

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Store the latest traffic light seconds in a ref
  const trafficLightSecondsRef = useRef(null);
  const [trafficLightSocket, setTrafficLightSocket] = useState(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside the popup
      const popups = document.querySelectorAll(".camera-popup");
      let clickedOutside = true;

      popups.forEach((popup) => {
        if (popup.contains(e.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

  // Manage WebSocket connection based on marker type
  useEffect(() => {
    const connectTrafficLightSocket = (svetoforId) => {
      // Prevent multiple connections for the same svetofor_id
      if (trafficLightSocket) {
        return trafficLightSocket;
      }

      const vendor = marker.vendor_id ?? marker.vendor ?? 1; // Try both vendor_id and vendor, fallback to 1

      const wsBaseUrl =
        Number(vendor) === 1
          ? import.meta.env.VITE_TRAFFICLIGHT_SOCKET
          : import.meta.env.VITE_TRAFFICLIGHT_SOCKET.replace(
              "/websocket/",
              "/websocketfama/"
            );

      const socket = new WebSocket(
        `${wsBaseUrl}?svetofor_id=${svetoforId}&token=${authToken}`
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
          setTrafficLightSocket(null);
        }
      };
    }
  }, [marker.svetofor_id, marker.type, dispatch]);

  // Auto-open popup at zoom level 20
  // We no longer need to control popup visibility based on zoom
  // as this is now handled by the PulsingMarkers component

  const handleOpenLink = () => {
    window.open(marker.url, "_blank");
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (!showPopup) return null;

  return (
    <>
      <MapLibrePopup
        map={map}
        coordinates={[parseFloat(marker.lng || 0), parseFloat(marker.lat || 0)]}
        isDraggable={isPopupDraggable}
        offset={[0, -30]}
        onClose={() => {
          // When a popup is closed, update the visible markers list
          console.log("Popup closed for marker:", marker.cid);
        }}
      >
        {marker.statuserror > 0 ? (
          <div className="backdrop-blur-md bg-red-800/80 p-2 rounded-lg">
            {" "}
            This camera is offline
          </div>
        ) : (
          <>
            <div className="popup-drag-handle flex justify-between items-center bg-gray-800/80 backdrop-blur-md rounded-t-lg ">
              <div className="text-white font-medium text-center w-full">
                {marker.cname || marker.id || marker.cid}
              </div>
              <button
                className="text-white hover:text-gray-300 focus:outline-none absolute right-2"
                onClick={() => {
                  // Close the popup
                  popupRef.current.remove();
                }}
              >
                ×
              </button>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col ">
                {marker.url && (
                  <button
                    onClick={handleOpenLink}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                  >
                    <FiExternalLink />
                    <span>{t("open_in_new_tab")}</span>
                  </button>
                )}
                {isPTZ && (
                  <button
                    onClick={openModal}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaVideo />
                    <span>{t("ptz_control")}</span>
                  </button>
                )}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "15vw",
                    overflow: "hidden",
                  }}
                >
                  <Records
                    videos={marker.cameraData.streams}
                    name={marker.cname || marker.id || marker.cid}
                    isLoading={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-800/30 backdrop-blur-md p-2">
                  <div className="w-1/3 flex items-center gap-2">
                    <button className="text-white p-1">
                      <FaVideo />
                    </button>
                    <button
                      className="text-white p-1"
                      onClick={() => setPTZOpen(true)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="text-white p-1"
                      onClick={() => {
                        window.open(
                          `${window.location.origin}/camera/${marker.cid}`,
                          "_blank"
                        );
                      }}
                    >
                      <FiExternalLink />
                    </button>
                  </div>
                  <div className="w-1/3">
                    <TrafficLightCounter
                      // trafficLightSeconds={trafficLightSecondsRef.current}
                      channelId={marker.link_id}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </MapLibrePopup>

      {isModalOpen && (
        <PTZCameraModal
          isOpen={isModalOpen}
          onClose={closeModal}
          cameraData={cameraData}
        />
      )}
    </>
  );
});

export default MapLibreCameraDetails;
