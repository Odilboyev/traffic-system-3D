import "./styles.css";

import { FaBus, FaSubway, FaTram } from "react-icons/fa";

import PropTypes from "prop-types";
import React from "react";

export const transportTypes = [
  { id: "bus", label: "Bus", Icon: FaBus },
  { id: "metro", label: "Metro", Icon: FaSubway },
  { id: "tram", label: "Tram", Icon: FaTram },
];

function TransportFilter({ selectedTypes, onTypeToggle }) {
  return (
    <div className="transport-filter">
      <div className="transport-filter-content">
        {transportTypes.map(({ id, label, Icon }) => (
          <label key={id} className="transport-filter-item">
            <input
              type="checkbox"
              checked={selectedTypes.includes(id)}
              onChange={() => onTypeToggle(id)}
              className="transport-filter-checkbox"
            />
            <Icon className="transport-filter-icon" />
            <span className="transport-filter-label">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

TransportFilter.propTypes = {
  selectedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTypeToggle: PropTypes.func.isRequired,
};

const MemoizedTransportFilter = React.memo(TransportFilter);
export default MemoizedTransportFilter;
