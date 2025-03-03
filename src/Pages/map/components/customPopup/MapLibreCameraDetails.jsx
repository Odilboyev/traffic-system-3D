import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { memo, useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { IconButton } from "@material-tailwind/react";
import { useDispatch } from "react-redux";

import MapLibrePopup from "./components/customPopup/MapLibrePopup";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";
import TrafficLightCounter from "./components/TrafficLightCounter";
import { authToken } from "../../../../api/api.config";
import { fixIncompleteJSON } from "../../components/trafficLightMarkers/utils";
import { updateTrafficLightSeconds } from "../../../../redux/slices/trafficLightSecondsSlice";

const MapLibreCameraDetails = memo(
  function MapLibreCameraDetails({ 
    marker = {}, 
    t, 
    isLoading, 
    cameraData, 
    isPTZ,
    map 
  }) {
    const dispatch = useDispatch();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isPopupDraggable, setIsPopupDraggable] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const handleCollapseToggle = () => {
      setIsCollapsed((prev) => !prev);
      setIsPopupDraggable((prev) => !prev);
    };

    // Store the latest traffic light seconds in a ref
    const trafficLightSecondsRef = useRef(null);
    const [trafficLightSocket, setTrafficLightSocket] = useState(null);

    // Manage WebSocket connection based on marker type
    useEffect(() => {
      const connectTrafficLightSocket = (svetoforId) => {
        if (trafficLightSocket) return trafficLightSocket;

        const socket = new WebSocket(
          `${import.meta.env.VITE_TRAFFICLIGHT_SOCKET}?svetofor_id=${svetoforId}&token=${authToken}`
        );

        socket.onopen = () => {
          console.log("Traffic light socket connected");
        };

        socket.onmessage = (event) => {
          try {
            const fixedData = fixIncompleteJSON(event.data);
            const data = JSON.parse(fixedData);
            trafficLightSecondsRef.current = data;
            dispatch(updateTrafficLightSeconds(data));
          } catch (error) {
            console.error("Error parsing socket data:", error);
          }
        };

        socket.onclose = () => {
          console.log("Traffic light socket closed");
          setTrafficLightSocket(null);
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
    useEffect(() => {
      if (!map) return;

      const handleZoom = () => {
        const zoom = map.getZoom();
        setShowPopup(zoom >= 20);
      };

      map.on('zoom', handleZoom);
      handleZoom(); // Check initial zoom level

      return () => {
        map.off('zoom', handleZoom);
      };
    }, [map]);

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
          coordinates={[marker.lng, marker.lat]}
          isDraggable={isPopupDraggable}
          offset={[0, -15]}
          className="camera-popup"
        >
          <div className="popup-content">
            <div className="popup-drag-handle flex justify-between items-center bg-gray-800 p-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FaVideo className="text-white" />
                <span className="text-white font-medium">
                  {t("camera")} {marker.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={handleCollapseToggle}
                  className="rounded-full text-white"
                >
                  {isCollapsed ? <FaPlus /> : <FaMinus />}
                </IconButton>
              </div>
            </div>

            {!isCollapsed && (
              <div className="p-4 bg-white rounded-b-lg">
                <div className="flex flex-col gap-4">
                  {marker.type === 1 && (
                    <TrafficLightCounter
                      trafficLightSeconds={trafficLightSecondsRef.current}
                    />
                  )}
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
                  <Records cameraData={cameraData} isLoading={isLoading} />
                </div>
              </div>
            )}
          </div>
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
  }
);

export default MapLibreCameraDetails;
