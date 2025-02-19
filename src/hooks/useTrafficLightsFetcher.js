import { useRef, useCallback } from 'react';

// Function to calculate distance between two points in meters
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

const useTrafficLightsFetcher = (getNearbyTrafficLights) => {
  const lastFetchRef = useRef({
    lat: null,
    lng: null,
    timestamp: null,
  });

  const shouldFetch = useCallback((center, zoom) => {
    // Check zoom level first
    if (zoom < 20) {
      return false;
    }

    const { lat, lng } = center;
    const { lat: lastLat, lng: lastLng } = lastFetchRef.current;

    // If this is the first fetch
    if (lastLat === null || lastLng === null) {
      return true;
    }

    // Calculate distance from last fetch point
    const distance = calculateDistance(lat, lng, lastLat, lastLng);
    
    // Return true if distance is greater than 400 meters
    return distance > 400;
  }, []);

  const fetchTrafficLights = useCallback(async (center, zoom) => {
    if (!shouldFetch(center, zoom)) {
      return null;
    }

    try {
      const { lat, lng } = center;
      const response = await getNearbyTrafficLights({
        lat: lat.toString(),
        lng: lng.toString(),
        zoom: zoom.toString(),
      });

      // Update last fetch reference
      lastFetchRef.current = {
        lat,
        lng,
        timestamp: Date.now(),
      };

      return response;
    } catch (error) {
      console.error('Error fetching traffic lights:', error);
      return null;
    }
  }, [getNearbyTrafficLights, shouldFetch]);

  return {
    fetchTrafficLights,
    shouldFetch,
  };
};

export default useTrafficLightsFetcher;
