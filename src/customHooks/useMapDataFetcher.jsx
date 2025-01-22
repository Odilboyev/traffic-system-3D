import { useEffect, useState } from "react";
import { useMapContext } from "../Pages/map/context/MapContext";

const useMapDataFetcher = ({
  fetchData,
  onClearData,
  onNewData,
  minZoom = 19,
  fetchDistanceThreshold = 100,
}) => {
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);
  const { map } = useMapContext();

  // Simple distance calculation (in meters)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMapEvents = () => {
    if (!map) return;

    const zoom = map.getZoom();
    if (zoom < minZoom) {
      onClearData?.();
      setLastSuccessfulLocation(null);
      return;
    }

    const center = map.getCenter();
    const currentLocation = { lat: center.lat, lng: center.lng };

    // Skip if we haven't moved far enough
    if (lastSuccessfulLocation) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        lastSuccessfulLocation.lat,
        lastSuccessfulLocation.lng
      );
      
      if (distance < fetchDistanceThreshold) {
        return;
      }
    }

    // Only fetch if we're either:
    // 1. First time fetching (no last location)
    // 2. Moved more than threshold distance
    fetchData({
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      zoom,
    }).then((response) => {
      if (response?.data) {
        onNewData?.(response.data);
        setLastSuccessfulLocation(currentLocation);
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    // Initial fetch
    handleMapEvents();

    // Add event listener only for moveend
    map.on("moveend", handleMapEvents);

    return () => {
      map.off("moveend", handleMapEvents);
    };
  }, [map]);

  return { lastSuccessfulLocation };
};

export default useMapDataFetcher;
