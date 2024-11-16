import { useMap, useMapEvents } from "react-leaflet";

import PropTypes from "prop-types";
import toaster from "../../../../tools/toastconfig";
import { useEffect } from "react";

const MapEvents = ({ changedMarker, setMarkers, setZoom, setMap }) => {
  const map = useMap();

  // Handle map movement and zoom events
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      localStorage.setItem(
        "mapCenter",
        JSON.stringify([+center.lat, +center.lng])
      );
    },
    zoomend: () => {
      const zoom = map.getZoom();
      localStorage.setItem("mapZoom", zoom);
      setZoom(zoom);
    },
  });

  // Add useEffect to handle changedMarker updates
  useEffect(() => {
    if (changedMarker) {
      toaster(changedMarker, map);
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.cid === changedMarker.cid && marker.type === changedMarker.type
            ? changedMarker
            : marker
        )
      );
    }
  }, [changedMarker]);

  useEffect(() => {
    setMap(map);
  }, []);

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
