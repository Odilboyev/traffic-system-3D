import React from "react";
import { IoClose } from "react-icons/io5";
import { MdLocalGasStation, MdAccessTime, MdDirections, MdStar, MdLocalOffer, MdPhoneEnabled } from "react-icons/md";

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const FuelTypeItem = ({ type, price, available }) => {
  return (
    <div className={`fuel-station-popup-fuel-item ${!available ? 'fuel-unavailable' : ''}`}>
      <div className="fuel-station-popup-fuel-type">
        <MdLocalGasStation />
        <span>{type}</span>
      </div>
      <div className="fuel-station-popup-fuel-price">
        {available ? formatPrice(price) : 'Not available'}
      </div>
    </div>
  );
};

const FuelStationPopup = ({ station, onClose }) => {
  return (
    <div className="fuel-station-popup-content">
      <div className="fuel-station-popup-header" style={{ backgroundColor: `${station.brand.color}20`, borderColor: station.brand.color }}>
        <div className="fuel-station-popup-title">
          <div className="fuel-station-popup-logo" style={{ backgroundColor: station.brand.color }}>
            <img src={station.brand.logo || "/images/fuel-station-default.svg"} alt={station.brand.name} />
          </div>
          <div>
            <h3>{station.name}</h3>
            <div className="fuel-station-popup-brand">{station.brand.name}</div>
          </div>
        </div>
        <button className="fuel-station-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="fuel-station-popup-body">
        <div className="fuel-station-popup-section">
          <h4 className="fuel-station-popup-section-title">Fuel Prices</h4>
          <div className="fuel-station-popup-fuel-list">
            {station.fuels.map((fuel, index) => (
              <FuelTypeItem 
                key={index}
                type={fuel.type}
                price={fuel.price}
                available={fuel.available}
              />
            ))}
          </div>
        </div>
        
        <div className="fuel-station-popup-info-row">
          <div className="fuel-station-popup-info-icon">
            <MdAccessTime />
          </div>
          <div className="fuel-station-popup-info-text">
            <div className="fuel-station-popup-info-label">Working Hours</div>
            <div className="fuel-station-popup-info-value">
              {station.workingHours}
            </div>
          </div>
        </div>
        
        <div className="fuel-station-popup-info-row">
          <div className="fuel-station-popup-info-icon">
            <MdStar />
          </div>
          <div className="fuel-station-popup-info-text">
            <div className="fuel-station-popup-info-label">Rating</div>
            <div className="fuel-station-popup-info-value">
              <div className="fuel-station-popup-rating">
                <span className="fuel-station-popup-rating-value">{station.rating}</span>
                <span className="fuel-station-popup-rating-count">({station.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
        
        {station.services && station.services.length > 0 && (
          <div className="fuel-station-popup-info-row">
            <div className="fuel-station-popup-info-icon">
              <MdLocalOffer />
            </div>
            <div className="fuel-station-popup-info-text">
              <div className="fuel-station-popup-info-label">Services</div>
              <div className="fuel-station-popup-info-value">
                <div className="fuel-station-popup-services">
                  {station.services.join(' • ')}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {station.phone && (
          <div className="fuel-station-popup-info-row">
            <div className="fuel-station-popup-info-icon">
              <MdPhoneEnabled />
            </div>
            <div className="fuel-station-popup-info-text">
              <div className="fuel-station-popup-info-label">Phone</div>
              <div className="fuel-station-popup-info-value">
                <a href={`tel:${station.phone}`} className="fuel-station-popup-phone">{station.phone}</a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="fuel-station-popup-footer">
        <button className="fuel-station-popup-action-button fuel-station-popup-directions-button">
          <MdDirections />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
};

export default FuelStationPopup;
