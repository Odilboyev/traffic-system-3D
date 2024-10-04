import { useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const useMapDataFetcher = ({
  fetchData, // function to fetch data
  onClearData, // function to clear data
  onNewData, // function to handle new data
  minZoom = 19, // optional minimum zoom level to trigger fetch
  fetchDistanceThreshold = 100, // optional distance threshold (in meters) for fetching data
}) => {
  const map = useMap();
  let lastSuccessfulLocation = null;

  const handleMapEvents = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();

    // Check if zoom level meets the requirement
    if (zoom >= minZoom) {
      fetchData({
        lat: center.lat,
        lng: center.lng,
        zoom,
      });
    } else {
      onClearData(); // Clear data when zoom is lower than the threshold
    }

    const currentLocation = L.latLng(center.lat, center.lng);

    if (lastSuccessfulLocation) {
      const distanceFromLast = currentLocation.distanceTo(
        lastSuccessfulLocation
      );

      // Only fetch if the distance moved exceeds the threshold
      if (distanceFromLast > fetchDistanceThreshold) {
        fetchData({
          lat: center.lat,
          lng: center.lng,
          zoom,
        });
      }
    }

    // Update the last successful location
    lastSuccessfulLocation = currentLocation;
  };

  useEffect(() => {
    handleMapEvents();
  }, []);

  useMapEvents({
    dragend: handleMapEvents,
    zoomend: handleMapEvents,
  });
};

export default useMapDataFetcher;
