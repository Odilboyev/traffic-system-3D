import React from "react";
import { IoClose } from "react-icons/io5";
import { MdVideocam, MdSensors, MdAccessTime, MdSpeed, MdTraffic, MdDirectionsCar } from "react-icons/md";

const getDeviceIcon = (type, size = "1.5em") => {
  let Icon;
  switch (type) {
    case "camera":
      Icon = MdVideocam;
      break;
    case "sensor":
      Icon = MdSensors;
      break;
    default:
      Icon = MdVideocam;
  }
  
  return <Icon size={size} />;
};

const getCongestionColor = (level) => {
  switch (level) {
    case "low":
      return "#10b981"; // green
    case "medium":
      return "#f59e0b"; // amber
    case "high":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray for unknown
  }
};

const getCongestionText = (level) => {
  switch (level) {
    case "low":
      return "Low congestion";
    case "medium":
      return "Medium congestion";
    case "high":
      return "High congestion";
    default:
      return "Unknown congestion";
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

const MonitoringPopup = ({ device, onClose }) => {
  const congestionColor = getCongestionColor(device.metrics.congestionLevel);
  
  return (
    <div className="monitoring-popup-content">
      <div className="monitoring-popup-header">
        <div className="monitoring-popup-title">
          <div className="monitoring-popup-icon" style={{ backgroundColor: congestionColor }}>
            {getDeviceIcon(device.type)}
          </div>
          <h3>{device.name}</h3>
        </div>
        <button className="monitoring-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="monitoring-popup-body">
        {device.status === 'active' && (
          <div className="monitoring-popup-metrics">
            <div className="monitoring-popup-metric">
              <div className="monitoring-popup-metric-icon">
                <MdDirectionsCar />
              </div>
              <div className="monitoring-popup-metric-value">
                {device.metrics.vehicleCount}
              </div>
              <div className="monitoring-popup-metric-label">Vehicles</div>
            </div>
            
            <div className="monitoring-popup-metric">
              <div className="monitoring-popup-metric-icon">
                <MdSpeed />
              </div>
              <div className="monitoring-popup-metric-value">
                {device.metrics.averageSpeed}
              </div>
              <div className="monitoring-popup-metric-label">Avg. Speed</div>
            </div>
            
            <div className="monitoring-popup-metric">
              <div className="monitoring-popup-metric-icon" style={{ color: congestionColor }}>
                <MdTraffic />
              </div>
              <div className="monitoring-popup-metric-value" style={{ color: congestionColor }}>
                {device.metrics.congestionLevel.charAt(0).toUpperCase() + device.metrics.congestionLevel.slice(1)}
              </div>
              <div className="monitoring-popup-metric-label">Congestion</div>
            </div>
          </div>
        )}
        
        <div className="monitoring-popup-details">
          <h4 className="monitoring-popup-section-title">Device Details</h4>
          <div className="monitoring-popup-detail-row">
            <div className="monitoring-popup-detail-label">Model</div>
            <div className="monitoring-popup-detail-value">{device.details.model}</div>
          </div>
          
          {device.type === 'camera' && (
            <>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Resolution</div>
                <div className="monitoring-popup-detail-value">{device.details.resolution}</div>
              </div>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Angle</div>
                <div className="monitoring-popup-detail-value">{device.details.angle}°</div>
              </div>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Night Vision</div>
                <div className="monitoring-popup-detail-value">{device.details.nightVision ? 'Yes' : 'No'}</div>
              </div>
            </>
          )}
          
          {device.type === 'sensor' && (
            <>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Type</div>
                <div className="monitoring-popup-detail-value">{device.details.type}</div>
              </div>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Range</div>
                <div className="monitoring-popup-detail-value">{device.details.range}m</div>
              </div>
              <div className="monitoring-popup-detail-row">
                <div className="monitoring-popup-detail-label">Accuracy</div>
                <div className="monitoring-popup-detail-value">{device.details.accuracy}</div>
              </div>
            </>
          )}
        </div>
        
        <div className="monitoring-popup-info-row">
          <div className="monitoring-popup-info-icon">
            <MdAccessTime />
          </div>
          <div className="monitoring-popup-info-text">
            <div className="monitoring-popup-info-label">Last Updated</div>
            <div className="monitoring-popup-info-value">
              {formatTimestamp(device.lastUpdated)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="monitoring-popup-footer">
        <div className="monitoring-popup-status" data-status={device.status}>
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </div>
        <div className="monitoring-popup-actions">
          <button className="monitoring-popup-action-button">View Details</button>
          {device.status !== 'active' && (
            <button className="monitoring-popup-action-button monitoring-popup-report-button">Report Issue</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPopup;
