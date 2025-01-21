import { useEffect, useState } from "react";
import { useMapContext } from "../Pages/map/context/MapContext";

const useMapDataFetcher = ({
  fetchData, // function to fetch data
  onClearData, // function to clear data
  onNewData, // function to handle new data
  minZoom = 13, // Lowered minimum zoom level
  fetchDistanceThreshold = 500, // Increased distance threshold for lower zoom
  useDistanceThreshold = true, // New prop with default value true
}) => {
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const { map } = useMapContext();

  // Calculate distance between two points in meters
  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Function to check distance and trigger fetch if conditions are met
  const handleMapEvents = () => {
    if (!map) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const currentLocation = { lat: center.lat, lng: center.lng };

    if (zoom >= minZoom) {
      // Modified condition to check useDistanceThreshold prop
      if (
        !lastSuccessfulLocation ||
        !useDistanceThreshold ||
        calculateDistance(currentLocation, lastSuccessfulLocation) >
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

  useEffect(() => {
    if (!map) return;

    // Initial trigger on mount
    handleMapEvents();

    // Set up event listeners for map movement
    map.on('moveend', handleMapEvents);
    map.on('zoomend', handleMapEvents);

    // Cleanup event listeners
    return () => {
      map.off('moveend', handleMapEvents);
      map.off('zoomend', handleMapEvents);
    };
  }, [map]);

  return {
    lastSuccessfulLocation,
    setLastSuccessfulLocation,
  };
};

export default useMapDataFetcher;
