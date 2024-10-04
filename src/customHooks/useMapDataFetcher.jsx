import { useCallback, useEffect, useState } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const useMapDataFetcher = ({
  fetchData, // function to fetch data
  onClearData, // function to clear data
  onNewData, // function to handle new data
  minZoom = 19, // optional minimum zoom level to trigger fetch
  fetchDistanceThreshold = 100, // optional distance threshold (in meters) for fetching data
}) => {
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const map = useMap();

  // Function to check distance and trigger fetch if conditions are met
  const handleMapEvents = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const currentLocation = L.latLng(center.lat, center.lng);

    if (zoom >= minZoom) {
      // Fetch data if zoom level meets the requirement
      if (
        !lastSuccessfulLocation ||
        currentLocation.distanceTo(lastSuccessfulLocation) >
          fetchDistanceThreshold
      ) {
        fetchData({
          lat: center.lat,
          lng: center.lng,
          zoom,
        });
        setLastSuccessfulLocation(currentLocation);
      }
    } else {
      // If zoom is lower than minZoom, clear the data and reset last location
      onClearData();
      if (lastSuccessfulLocation !== null) {
        setLastSuccessfulLocation(null); // Only clear if it's not already null
      }
    }
  };

  // Effect to trigger the map event handler when component is mounted and on zoom or drag end
  useEffect(() => {
    handleMapEvents(); // Initial trigger on mount
  }, []);

  // Set up event listeners for map dragging and zooming
  useMapEvents({
    dragend: handleMapEvents,
    zoomend: handleMapEvents,
  });
};

export default useMapDataFetcher;
