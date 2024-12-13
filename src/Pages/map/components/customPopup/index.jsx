import "./popup.style.css";

import { FaMinus, FaPlus, FaVideo } from "react-icons/fa6";
import { Popup, Tooltip } from "react-leaflet";
import { memo, useRef, useState } from "react";

import { FiExternalLink } from "react-icons/fi";
import { IconButton } from "@material-tailwind/react";
import PTZCameraModal from "./components/ptzModal";
import Records from "./components/records";

const CameraDetails = memo(
  function CameraDetails({ marker = {}, t, isLoading, cameraData, isPTZ, L }) {
    const popupRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const handleCollapseToggle = () => {
      setIsCollapsed((prev) => !prev);
    };
    const [showToolTip, setShowToolTip] = useState(false);

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
        {" "}
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

              {/* Collapsible Description */}

              {/* <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mb-2 hover:bg-blue-700"
                  onClick={handleCollapseToggle}
                >
                  {isCollapsed ? t("Show Details") : t("Hide Details")}
                </button> */}

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
                  {/* <p>
                    <strong>{t("Updated_On")}: </strong>
                    {cameraData.dateupdate}
                  </p> */}
                </div>
              )}

              {/* Open Link Button */}
              {/* <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={handleOpenLink}
              >
                {t("Open Camera in New Tab")}
              </button> */}
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
  (prevProps, nextProps) => {
    // Only re-render if marker data changes
    return (
      prevProps.marker.cid === nextProps.marker.cid &&
      prevProps.marker.type === nextProps.marker.type
    );
  }
);

export default CameraDetails;
