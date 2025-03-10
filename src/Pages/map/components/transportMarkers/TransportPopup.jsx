import React from "react";
import { FaBus, FaSubway, FaTram, FaRegClock, FaMapMarkerAlt, FaUsers, FaTachometerAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const getTransportIcon = (type, size = "1.5em") => {
  let Icon;
  switch (type) {
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

const getOccupancyColor = (occupancy) => {
  switch (occupancy) {
    case "low":
      return "#10b981"; // green
    case "medium":
      return "#f59e0b"; // amber
    case "high":
      return "#ef4444"; // red
    default:
      return "#10b981";
  }
};

const getOccupancyText = (occupancy) => {
  switch (occupancy) {
    case "low":
      return "Low occupancy";
    case "medium":
      return "Medium occupancy";
    case "high":
      return "High occupancy";
    default:
      return "Unknown occupancy";
  }
};

const TransportPopup = ({ vehicle, route, onClose }) => {
  const occupancyColor = getOccupancyColor(vehicle.occupancy);
  
  return (
    <div className="transport-popup-content">
      <div className="transport-popup-header" style={{ background: `linear-gradient(to right, ${route.color}40, transparent)` }}>
        <div className="transport-popup-title">
          <div className="transport-popup-icon" style={{ color: route.color }}>
            {getTransportIcon(vehicle.type)}
          </div>
          <h3>{route.name}</h3>
        </div>
        <button className="transport-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="transport-popup-body">
        <div className="transport-popup-info-row">
          <div className="transport-popup-info-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="transport-popup-info-text">
            <div className="transport-popup-info-label">Next stop</div>
            <div className="transport-popup-info-value">{vehicle.nextStop}</div>
          </div>
        </div>
        
        <div className="transport-popup-info-row">
          <div className="transport-popup-info-icon" style={{ color: vehicle.onTime ? "#10b981" : "#ef4444" }}>
            <FaRegClock />
          </div>
          <div className="transport-popup-info-text">
            <div className="transport-popup-info-label">Status</div>
            <div className="transport-popup-info-value" style={{ color: vehicle.onTime ? "#10b981" : "#ef4444" }}>
              {vehicle.onTime ? "On time" : `Delayed by ${vehicle.delayMinutes} min`}
            </div>
          </div>
        </div>
        
        <div className="transport-popup-info-row">
          <div className="transport-popup-info-icon" style={{ color: occupancyColor }}>
            <FaUsers />
          </div>
          <div className="transport-popup-info-text">
            <div className="transport-popup-info-label">Occupancy</div>
            <div className="transport-popup-info-value" style={{ color: occupancyColor }}>
              {getOccupancyText(vehicle.occupancy)}
            </div>
          </div>
        </div>
        
        <div className="transport-popup-info-row">
          <div className="transport-popup-info-icon">
            <FaTachometerAlt />
          </div>
          <div className="transport-popup-info-text">
            <div className="transport-popup-info-label">Speed</div>
            <div className="transport-popup-info-value">
              {vehicle.speed} km/h
            </div>
          </div>
        </div>
      </div>
      
      <div className="transport-popup-footer">
        <div className="transport-popup-route-info">
          View full route details
        </div>
      </div>
    </div>
  );
};

export default TransportPopup;
