import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const MapEvents = ({ changedMarker, setZoom }) => {
  const map = useMap();

  // Handle map movement and zoom events
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      localStorage.setItem(
        "mapCenter",
        JSON.stringify([center.lat, center.lng])
      );
    },
    zoomend: () => {
      const zoom = map.getZoom();
      localStorage.setItem("mapZoom", zoom);
      setZoom(zoom);
    },
  });

  return null; // This component doesn't render anything
};

MapEvents.propTypes = {
  changedMarker: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    cid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  setZoom: PropTypes.func.isRequired,
};

export default MapEvents;
