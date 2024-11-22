import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";

import { FaTimes } from "react-icons/fa";
import Joystick from "./joyStick";
import { modifyPTZCamera } from "../../../../../../api/api.handlers";
import { t } from "i18next";
import { useSelector } from "react-redux";

const PTZCameraModal = ({ isOpen, onClose, cameraData }) => {
  const isHighQuality = useSelector((state) => state.map.isHighQuality);

  const sendCommand = async (command, pan, tilt) => {
    const xmlData =
      command === "control"
        ? `<?xml version="1.0" encoding="UTF-8"?><PTZData><pan>${pan}</pan><tilt>${tilt}</tilt></PTZData>`
        : `<?xml version="1.0" encoding="UTF-8"?><PTZData><zoom>${pan}</zoom></PTZData>`;

    const data = {
      zoom: command,
      xml: xmlData,
      ip: cameraData.ip,
      http_port: cameraData.port,
      login: "admin",
      password: "12345678a",
    };
    try {
      const res = await modifyPTZCamera(JSON.stringify(data));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDirectionControl = (direction, isActive) => {
    const directions = {
      up: { pan: 0, tilt: 60 },
      down: { pan: 0, tilt: -60 },
      left: { pan: -60, tilt: 0 },
      right: { pan: 60, tilt: 0 },
      "up-left": { pan: -60, tilt: 60 },
      "up-right": { pan: 60, tilt: 60 },
      "down-left": { pan: -60, tilt: -60 },
      "down-right": { pan: 60, tilt: -60 },
    };

    const { pan, tilt } = directions[direction];
    if (isActive) {
      sendCommand("control", pan, tilt);
    } else {
      sendCommand("control", 0, 0); // Stop movement
    }
  };

  const handleZoomControl = (zoom, isActive) => {
    const zoomLevels = {
      "zoom-in": 60,
      "zoom-out": -60,
    };

    if (isActive) {
      sendCommand("zoom", zoomLevels[zoom], 0);
    } else {
      sendCommand("zoom", 0, 0); // Stop zoom
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-900 "
    >
      {/* Header */}
      <DialogHeader className="flex items-center justify-between dark:text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">
          {cameraData?.name || "Camera Details"}
        </h2>
        <IconButton onClick={onClose} size="sm" className="text-white">
          <FaTimes />
        </IconButton>
      </DialogHeader>

      {/* Body */}
      <DialogBody className="flex p-4 gap-4 max-h-[70vh] h-[70vh] overfolow-y-scroll">
        {/* Sidebar */}
        <div className="w-1/5 p-4 border border-gray-600 rounded-lg">
          <h3 className="text-sm font-bold mb-4">{t("camera_controls")}</h3>
          {/* Joystick Placeholder */}
          <Joystick
            onDirectionControl={handleDirectionControl}
            onZoomControl={handleZoomControl}
          />

          {/* Additional Details */}
          <div className="mt-6">
            <p>
              <strong>IP:</strong> {cameraData?.ip || "N/A"}
            </p>
            <p>
              <strong>Port:</strong> {cameraData?.http_port || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex-flex-wrap ">
          {/* Main Content */}
          {cameraData?.streams.map((video, index) => {
            // Modify the mselink based on isHighQuality
            const updatedLink = video.mselink.replace(
              /.$/,
              isHighQuality ? "1" : "0"
            );
            return (
              <iframe
                key={index}
                className="space-x-0 space-y-0"
                width="100%"
                style={{
                  margin: "0 auto",
                  border: "none",
                  padding: 0,
                  minWidth: "400px",
                  minHeight: "300px",
                }}
                src={updatedLink}
                allowFullScreen
              ></iframe>
            );
          })}
        </div>
      </DialogBody>

      {/* Footer (Optional) */}
      <DialogFooter className="bg-gray-900 rounded-b-lg flex justify-end p-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Close
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default PTZCameraModal;
