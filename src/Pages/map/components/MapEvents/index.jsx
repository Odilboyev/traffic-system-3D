import { useEffect, useReducer } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import PropTypes from "prop-types";
import toaster from "../../../../tools/toastconfig";
import { useMapMarkers } from "../../hooks/useMapMarkers";

// Create a reducer function to handle marker updates efficiently
const markersReducer = (state, action) => {
  switch (action.type) {
    case "BATCH_UPDATE_MARKERS": {
      // Create a map of markers to update for efficient lookup
      const updateMap = new Map(
        action.payload.map((marker) => [`${marker.cid}-${marker.type}`, marker])
      );

      return state.map((marker) => {
        const key = `${marker.cid}-${marker.type}`;
        return updateMap.has(key) ? updateMap.get(key) : marker;
      });
    }
    default:
      return state;
  }
};

/**
 * Handles map events such as movement and zoom changes.
 *
 * @param {Array} changedMarkers - changed marker data from the server
 *
 * @returns {null}
 */
const MapEvents = ({ changedMarkers = [] }) => {
  const map = useMap();
  const { markers: initialMarkers } = useMapMarkers();
  const [markers, dispatchMarkers] = useReducer(markersReducer, initialMarkers);

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

    const zoom = map.getZoom();
    localStorage.setItem("its_currentZoom", zoom);
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
    },
  });

  // Add useEffect to handle changedMarkers updates
  // useEffect(() => {
  //   if (changedMarkers && changedMarkers.length > 0) {
  //     // Batch process notifications
  //     changedMarkers.forEach((changedMarker) => {
  //       toaster(changedMarker, map);
  //     });

  //     // Dispatch batch marker update
  //     dispatchMarkers({
  //       type: "BATCH_UPDATE_MARKERS",
  //       payload: changedMarkers,
  //     });
  //   }
  // }, [changedMarkers]);

  // Optional: Expose markers to parent components if needed
  // useEffect(() => {
  //   // You might want to update the markers in the parent component or context
  //   // This depends on how your state management is set up
  // }, [markers]);

  return null;
};

MapEvents.propTypes = {
  changedMarkers: PropTypes.arrayOf(PropTypes.object),
};

export default MapEvents;
