import "./styles.css";

import { FaBus, FaSubway, FaTram } from "react-icons/fa";
import { FaMapMarkerAlt, FaRegClock, FaRoute } from "react-icons/fa";

import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";
import React from "react";

export const transportTypes = [
  { id: "bus", label: "Bus", Icon: FaBus },
  { id: "metro", label: "Metro", Icon: FaSubway },
  { id: "tram", label: "Tram", Icon: FaTram },
];
export const getTransportIcon = (type, size = "1.5em") => {
  let Icon;
  switch (type?.toLowerCase()) {
    case "bus":
      Icon = FaBus;
      break;
    case "metro":
      Icon = FaSubway;
      break;
    case "tram":
      Icon = FaTram;
      break;
    default:
      Icon = FaBus;
  }
  return <Icon size={size} />;
};
function TransportPopup({ route, onClose }) {
  return (
    <div className="transport-popup">
      <div
        className="transport-popup-header"
        style={{ backgroundColor: route.color || "#4A90E2" }}
      >
        <div className="transport-popup-title">
          <div className="transport-popup-icon">
            {getTransportIcon(route.type)}
          </div>
          <h3>Route {route.name}</h3>
        </div>
        <button className="transport-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>

      <div className="transport-popup-content">
        <div className="transport-popup-info">
          <div className="transport-popup-info-row">
            <FaRoute className="transport-popup-row-icon" />
            <span>Route Type: {route.type || "Bus"}</span>
          </div>

          <div className="transport-popup-info-row">
            <FaRegClock className="transport-popup-row-icon" />
            <span>Schedule: 06:00 - 23:00</span>
          </div>

          <div className="transport-popup-info-row">
            <FaMapMarkerAlt className="transport-popup-row-icon" />
            <span>Length: {(route.path.length / 10).toFixed(1)} km</span>
          </div>
        </div>
      </div>
    </div>
  );
}

TransportPopup.propTypes = {
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    color: PropTypes.string,
    path: PropTypes.array,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const MemoizedTransportPopup = React.memo(TransportPopup);
export default MemoizedTransportPopup;
