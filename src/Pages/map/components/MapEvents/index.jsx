import { useMap, useMapEvents } from "react-leaflet";

import PropTypes from "prop-types";
import toaster from "../../../../tools/toastconfig";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useMapMarkers } from "../../hooks/useMapMarkers";

const MapEvents = ({ setZoom }) => {
  const map = useMap();
  const dispatch = useDispatch();
  const { markers, setMarkers } = useMapMarkers();

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
    if (markers.length > 0) {
      // Logic for handling updates (for example, after marker has changed)
      // Assuming 'changedMarker' is available in the state or props
      const changedMarker = markers.find((marker) => marker.cid === "someId"); // You can adjust this logic based on your requirements
      if (changedMarker) {
        toaster(changedMarker, map);

        setMarkers(
          markers.map((marker) =>
            marker.cid === changedMarker.cid &&
            marker.type === changedMarker.type
              ? changedMarker
              : marker
          )
        );
      }
    }
  }, [markers, dispatch, map, setZoom]);

  // Update map reference
  useEffect(() => {
    // You can manage this map state globally in Redux if necessary
    // setMap(map);
  }, [map]);

  return null; // This component doesn't render anything
};

MapEvents.propTypes = {
  setZoom: PropTypes.func.isRequired,
};

export default MapEvents;
