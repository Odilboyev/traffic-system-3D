import React from "react";
import { MdSpeed, MdTraffic, MdAirlineSeatReclineNormal, MdLayers, MdLocalParking, MdDirectionsCar, MdAttachMoney, MdAccessTime, MdPhotoCamera } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const getFineIcon = (type, size = "1.5em") => {
  let Icon;
  switch (type) {
    case "speeding":
      Icon = MdSpeed;
      break;
    case "red_light":
      Icon = MdTraffic;
      break;
    case "no_seatbelt":
      Icon = MdAirlineSeatReclineNormal;
      break;
    case "wrong_lane":
      Icon = MdLayers;
      break;
    case "parking":
      Icon = MdLocalParking;
      break;
    default:
      Icon = MdSpeed;
  }
  
  return <Icon size={size} />;
};

const getFineColor = (type) => {
  switch (type) {
    case "speeding":
      return "#ef4444"; // red
    case "red_light":
      return "#f97316"; // orange
    case "no_seatbelt":
      return "#eab308"; // yellow
    case "wrong_lane":
      return "#3b82f6"; // blue
    case "parking":
      return "#8b5cf6"; // purple
    default:
      return "#ef4444";
  }
};

const getFineTypeName = (type) => {
  switch (type) {
    case "speeding":
      return "Speeding";
    case "red_light":
      return "Red Light Violation";
    case "no_seatbelt":
      return "No Seatbelt";
    case "wrong_lane":
      return "Wrong Lane Usage";
    case "parking":
      return "Illegal Parking";
    default:
      return "Traffic Violation";
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const FinePopup = ({ fine, onClose }) => {
  const fineColor = getFineColor(fine.type);
  const fineTypeName = getFineTypeName(fine.type);
  
  return (
    <div className="fine-popup-content">
      <div className="fine-popup-header" style={{ backgroundColor: `${fineColor}20`, borderColor: fineColor }}>
        <div className="fine-popup-title">
          <div className="fine-popup-icon" style={{ color: fineColor }}>
            {getFineIcon(fine.type)}
          </div>
          <h3>{fineTypeName}</h3>
        </div>
        <button className="fine-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="fine-popup-body">
        <div className="fine-popup-info-row">
          <div className="fine-popup-info-icon">
            <MdDirectionsCar />
          </div>
          <div className="fine-popup-info-text">
            <div className="fine-popup-info-label">Vehicle</div>
            <div className="fine-popup-info-value">
              <span className="fine-popup-plate">{fine.vehicle.plate}</span>
              <span className="fine-popup-vehicle-details">
                {fine.vehicle.color} {fine.vehicle.make} {fine.vehicle.model}
              </span>
            </div>
          </div>
        </div>
        
        <div className="fine-popup-info-row">
          <div className="fine-popup-info-icon">
            <MdAttachMoney />
          </div>
          <div className="fine-popup-info-text">
            <div className="fine-popup-info-label">Fine Amount</div>
            <div className="fine-popup-info-value fine-popup-amount">
              {formatCurrency(fine.fine)}
            </div>
          </div>
        </div>
        
        {fine.type === "speeding" && (
          <div className="fine-popup-info-row">
            <div className="fine-popup-info-icon" style={{ color: fineColor }}>
              <MdSpeed />
            </div>
            <div className="fine-popup-info-text">
              <div className="fine-popup-info-label">Speed</div>
              <div className="fine-popup-info-value">
                <span className="fine-popup-speed">{fine.speed} km/h</span>
                <span className="fine-popup-speed-limit">Limit: {fine.speedLimit} km/h</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="fine-popup-info-row">
          <div className="fine-popup-info-icon">
            <MdAccessTime />
          </div>
          <div className="fine-popup-info-text">
            <div className="fine-popup-info-label">Time</div>
            <div className="fine-popup-info-value">
              {formatTimestamp(fine.timestamp)}
            </div>
          </div>
        </div>
        
        <div className="fine-popup-info-row">
          <div className="fine-popup-info-icon">
            <MdPhotoCamera />
          </div>
          <div className="fine-popup-info-text">
            <div className="fine-popup-info-label">Evidence</div>
            <div className="fine-popup-info-value">
              {fine.images.length} photo{fine.images.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      
      <div className="fine-popup-footer">
        <div className="fine-popup-status" data-status={fine.status}>
          {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
        </div>
        <div className="fine-popup-actions">
          <button className="fine-popup-action-button">View Details</button>
          <button className="fine-popup-action-button fine-popup-pay-button">Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default FinePopup;
