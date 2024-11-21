import { useMap, useMapEvents } from "react-leaflet";

import PropTypes from "prop-types";
import toaster from "../../../../tools/toastconfig";
import { useEffect } from "react";
import { useMapMarkers } from "../../hooks/useMapMarkers";

/**
 * Handles map events such as movement and zoom changes.
 *
 * @param {Object} changedMarker - changed marker data from the server
 * @param {Function} setZoom - function to update the zoom level in the state
 *
 * @returns {null}
 */
const MapEvents = ({ changedMarker, setZoom }) => {
  const map = useMap();
  const { markers, setMarkers } = useMapMarkers();
  const center = map.getCenter();
  useEffect(() => {
    if (center)
      localStorage.setItem(
        "its_currentLocation",
        JSON.stringify([+center.lat, +center.lng])
      );
    else
      localStorage.setItem(
        "its_currentLocation",
        JSON.stringify([[41.2995, 69.2401]])
      );
  });
  // Handle map movement and zoom events
  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      localStorage.setItem(
        "its_currentLocation",
        JSON.stringify([+center.lat, +center.lng])
      );
    },

    zoomend: () => {
      const zoom = map.getZoom();
      localStorage.setItem("its_currentZoom", zoom);
      setZoom(zoom);
    },
  });

  // Add useEffect to handle changedMarker updates
  useEffect(() => {
    if (changedMarker) {
      toaster(changedMarker, map);

      setMarkers(
        markers.map((marker) =>
          marker.cid === changedMarker.cid && marker.type === changedMarker.type
            ? changedMarker
            : marker
        )
      );
    }
  }, [changedMarker]);

  return null;
};

MapEvents.propTypes = {
  changedMarkers: PropTypes.object,
};

export default MapEvents;
