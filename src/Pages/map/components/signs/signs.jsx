import "./Signs.css";

import { useEffect, useState } from "react";

import CustomMarker from "./customMarker";
import { FaXmark } from "react-icons/fa6";
import PropTypes from "prop-types";
import { getNearbySigns } from "../../../../api/api.handlers";
import { t } from "i18next";
import { useMap } from "react-leaflet";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";

const Signs = ({
  signs, // signs state
  setSigns, // setter for signs
  clearSigns, // function to clear signs data
}) => {
  const [selectedSign, setSelectedSign] = useState(null);
  const [location, setLocation] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const map = useMap();
  const zoom = map.getZoom();
  useEffect(() => {
    zoom <= 18 && closePopup();
  }, [zoom]);

  const handleSignClick = (sign, location) => {
    setSelectedSign(sign);
    setLocation(location);

    // Convert geographical coordinates to container pixel position
    const point = map.latLngToContainerPoint(location);
    setPopupPosition(point);
  };

  const closePopup = () => {
    setSelectedSign(null);
    setLocation(null);
  };

  // Update the popup position whenever the map moves
  useEffect(() => {
    if (location) {
      const updatePopupPosition = () => {
        const point = map.latLngToContainerPoint(location);
        setPopupPosition(point);
      };

      // Update the position when the map is moved or zoomed
      map.on("move", updatePopupPosition);
      map.on("zoom", updatePopupPosition);

      // Cleanup listeners on unmount or when location changes
      return () => {
        map.off("move", updatePopupPosition);
        map.off("zoom", updatePopupPosition);
      };
    }
  }, [location, map]);

  useMapDataFetcher({
    fetchData: async (body) => {
      const response = await getNearbySigns(body);
      if (response.status === "error") {
        console.error(response.message);
        clearSigns();
        return;
      }
      setSigns(response.data);
    },
    onClearData: clearSigns,
    minZoom: 18,
    fetchDistanceThreshold: 100,
  });

  return (
    <div>
      {signs.map((v, i) => (
        <CustomMarker
          key={i}
          position={[v.lat, v.lng]}
          v={v}
          handleSignClick={handleSignClick}
        />
      ))}

      {/* Custom Popup positioned using absolute positioning */}
      {selectedSign && popupPosition && (
        <div
          className="custom-popup"
          style={{
            position: "absolute",
            top: popupPosition.y + selectedSign?.index * 260,
            left: popupPosition.x + 10, // Adjust for positioning right of the marker
            transform: "translate(8%, -100%)", // Adjusts the popup vertically above the icon
            zIndex: 1000,
          }}
        >
          <div className="custom-popup-content max-w-96 dark:bg-white text-white dark:text-blue-gray-800 p-6 pt-8 rounded-md bg-gray-900 backdrop-blur-md">
            <button className="close-button" onClick={closePopup}>
              <FaXmark />
            </button>
            <div style={{ fontSize: "14px" }}>
              <strong>{t("roadsign_code")}:</strong>{" "}
              {selectedSign.roadsign_code} <br />
              <strong>{t("roadsign_description")}:</strong>{" "}
              {selectedSign.roadsign_description} <br />
              <strong>{t("roadsign_installation_date")}:</strong>{" "}
              {selectedSign.roadsign_installation_date} <br />
              <strong>{t("removal_date")}:</strong>{" "}
              {selectedSign.removal_date || "--"} <br />
              <strong>{t("status")}:</strong>{" "}
              <span
                className={
                  selectedSign.status === "active"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {selectedSign.status === "active"
                  ? "Installed"
                  : "Not Installed"}
              </span>
            </div>
          </div>
          {/* Triangle pointing to the marker */}
        </div>
      )}
    </div>
  );
};

Signs.propTypes = {
  signs: PropTypes.array,
  setSigns: PropTypes.func,
  clearSigns: PropTypes.func,
};

export default Signs;
