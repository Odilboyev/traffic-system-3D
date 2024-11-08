import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const MapEvents = ({ changedMarker, fetchAlarmsData, setZoom }) => {
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

  // Set up periodic alarm fetching
  useEffect(() => {
    const alarmInterval = setInterval(() => {
      fetchAlarmsData();
    }, 30000); // Fetch alarms every 30 seconds

    return () => clearInterval(alarmInterval);
  }, [fetchAlarmsData]);

  return null; // This component doesn't render anything
};

MapEvents.propTypes = {
  changedMarker: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    cid: PropTypes.string,
    type: PropTypes.string,
  }),
  fetchAlarmsData: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
};

export default MapEvents;
