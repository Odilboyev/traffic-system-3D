import L from "leaflet";
import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const useMapDataFetcher = ({
  fetchData, // function to fetch data
  onClearData, // function to clear data
  onNewData, // function to handle new data
  minZoom = 19, // optional minimum zoom level to trigger fetch
  fetchDistanceThreshold = 100, // optional distance threshold (in meters) for fetching data
  useDistanceThreshold = true, // New prop with default value true
}) => {
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const map = useMap();

  // Function to check distance and trigger fetch if conditions are met
  const handleMapEvents = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const currentLocation = L.latLng(center.lat, center.lng);

    if (zoom >= minZoom) {
      // Calculate distance only if we have a last location
      const distance = lastSuccessfulLocation
        ? currentLocation.distanceTo(lastSuccessfulLocation)
        : Infinity;

      // Debug logging
      console.log("Distance moved:", distance);
      console.log("Threshold:", fetchDistanceThreshold);
      console.log("Last location:", lastSuccessfulLocation);

      if (
        !lastSuccessfulLocation ||
        !useDistanceThreshold ||
        distance > fetchDistanceThreshold
      ) {
        console.log("Fetching new data...");
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
      setLastSuccessfulLocation(null);
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
