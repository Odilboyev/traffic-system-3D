import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { memo, useEffect, useRef, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import MapLibrePopup from "./components/customPopup/MapLibrePopup";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";
import TrafficLightCounter from "./components/TrafficLightCounter";
import WebSocketManager from "../../../../utils/WebSocketManager";
import { updateTrafficLightSeconds } from "../../../../redux/slices/trafficLightSecondsSlice";
import { useDispatch } from "react-redux";

const MapLibreCameraDetails = memo(function MapLibreCameraDetails({
  marker = {},
  t,
  isLoading,
  cameraData,
  isPTZ,
  map,
  onClose, // Add onClose prop
}) {
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [PTZModalOpen, setPTZModalOpen] = useState(false);

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Store the latest traffic light seconds in a ref
  const trafficLightSecondsRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // More efficient event handling
      if (!popupRef.current) return;

      const isClickOutside = !popupRef.current.contains(e.target);

      if (isClickOutside && !isCollapsed) {
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
    // Only connect for traffic light markers
    if (marker.type === 1 && marker.svetofor_id) {
      const handleTrafficLightMessage = (data) => {
        try {
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
                countdown: channelSeconds[marker.link_id]?.countdown,
                status: channelSeconds[marker.link_id]?.status,
              })
            );
          }
        } catch (error) {
          console.error(
            "Error processing traffic light WebSocket message:",
            error
          );
        }
      };

      // Connect using WebSocketManager
      WebSocketManager.connect(
        marker.svetofor_id,
        marker.vendor_id ?? marker.vendor ?? 1,
        handleTrafficLightMessage
      );

      // Cleanup function
      return () => {
        WebSocketManager.disconnect(
          marker.svetofor_id,
          marker.vendor_id ?? marker.vendor ?? 1,
          handleTrafficLightMessage
        );
      };
    }
  }, [marker.svetofor_id, marker.type, marker.link_id, marker.vendor_id, marker.vendor, dispatch]);

  const handleOpenLink = () => {
    const { ip, http_port } = marker.cameraData;
    const url = `http://${ip}:${http_port}`;
    window.open(url, "_blank");
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <MapLibrePopup
        map={map}
        coordinates={[parseFloat(marker.lng || 0), parseFloat(marker.lat || 0)]}
        isDraggable={true}
        offset={[0, -30]}
        markerId={marker.cid} // Pass the marker ID
        onClose={() => {
          // When a popup is closed, update the visible markers list
          console.log("Popup closed for marker:", marker.cid);
        }}
      >
        {marker.statuserror > 0 ? (
          <div className="backdrop-blur-md bg-red-800/80 p-2 rounded-lg">
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
                  // Call the onClose prop to handle popup removal
                  if (typeof onClose === "function") {
                    onClose(marker.cid);
                  }
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
                      onClick={() => setPTZModalOpen(true)}
                    >
                      <FaPlus />
                    </button>
                    <button className="text-white p-1" onClick={handleOpenLink}>
                      <FiExternalLink />
                    </button>
                  </div>
                  {marker.link_id && (
                    <div className="w-1/3">
                      <TrafficLightCounter channelId={marker.link_id} />
                    </div>
                  )}
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
