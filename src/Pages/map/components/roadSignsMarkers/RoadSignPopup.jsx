import React from "react";
import { IoClose } from "react-icons/io5";
import { MdUpdate, MdDirections, MdInfo } from "react-icons/md";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getDirectionText = (direction) => {
  switch (direction) {
    case "north":
      return "Northbound";
    case "south":
      return "Southbound";
    case "east":
      return "Eastbound";
    case "west":
      return "Westbound";
    case "both":
      return "Both directions";
    case "all":
      return "All directions";
    default:
      return "Unknown direction";
  }
};

const RoadSignPopup = ({ roadSign, roadSignType, onClose }) => {
  return (
    <div className="road-sign-popup-content">
      <div className="road-sign-popup-header">
        <div className="road-sign-popup-title">
          <div className="road-sign-popup-icon">
            {/* This would be an actual image in a real app */}
            <div className="road-sign-icon-placeholder"></div>
          </div>
          <h3>{roadSignType.name}</h3>
          {roadSign.type === "speed_limit" && (
            <div className="road-sign-popup-speed-limit">{roadSign.value} km/h</div>
          )}
        </div>
        <button className="road-sign-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="road-sign-popup-body">
        <div className="road-sign-popup-description">
          <div className="road-sign-popup-info-icon">
            <MdInfo />
          </div>
          <div className="road-sign-popup-info-text">
            {roadSignType.description}
          </div>
        </div>
        
        <div className="road-sign-popup-info-row">
          <div className="road-sign-popup-info-icon">
            <MdDirections />
          </div>
          <div className="road-sign-popup-info-text">
            <div className="road-sign-popup-info-label">Direction</div>
            <div className="road-sign-popup-info-value">
              {getDirectionText(roadSign.direction)}
            </div>
          </div>
        </div>
        
        <div className="road-sign-popup-info-row">
          <div className="road-sign-popup-info-icon">
            <MdUpdate />
          </div>
          <div className="road-sign-popup-info-text">
            <div className="road-sign-popup-info-label">Last Updated</div>
            <div className="road-sign-popup-info-value">
              {formatDate(roadSign.lastUpdated)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="road-sign-popup-footer">
        <div className="road-sign-popup-status" data-status={roadSign.status}>
          {roadSign.status.charAt(0).toUpperCase() + roadSign.status.slice(1)}
        </div>
        <div className="road-sign-popup-actions">
          <button className="road-sign-popup-action-button">View Details</button>
          <button className="road-sign-popup-action-button road-sign-popup-report-button">Report Issue</button>
        </div>
      </div>
    </div>
  );
};

export default RoadSignPopup;
