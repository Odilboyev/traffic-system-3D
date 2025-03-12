import { useCallback, useEffect, useRef, useState } from "react";

import { getNearbySigns } from "../../../api/api.handlers";

// Mock road signs data - in a real app, this would come from an API
const mockRoadSignsData = [
  {
    id: 1,
    location: {
      lat: 41.305,
      lng: 69.248,
    },
    type: "speed_limit",
    value: 60,
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: 2,
    location: {
      lat: 41.302,
      lng: 69.252,
    },
    type: "stop",
    direction: "north",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
  },
  {
    id: 3,
    location: {
      lat: 41.298,
      lng: 69.245,
    },
    type: "no_entry",
    direction: "east",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days ago
  },
  {
    id: 4,
    location: {
      lat: 41.307,
      lng: 69.24,
    },
    type: "yield",
    direction: "south",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 28 days ago
  },
  {
    id: 5,
    location: {
      lat: 41.3,
      lng: 69.255,
    },
    type: "no_parking",
    direction: "west",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(), // 35 days ago
  },
  {
    id: 6,
    location: {
      lat: 41.304,
      lng: 69.238,
    },
    type: "no_overtaking",
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString(), // 42 days ago
  },
  {
    id: 7,
    location: {
      lat: 41.296,
      lng: 69.25,
    },
    type: "pedestrian_crossing",
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 49).toISOString(), // 49 days ago
  },
  {
    id: 8,
    location: {
      lat: 41.309,
      lng: 69.247,
    },
    type: "traffic_light",
    direction: "all",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 56).toISOString(), // 56 days ago
  },
  {
    id: 9,
    location: {
      lat: 41.301,
      lng: 69.242,
    },
    type: "speed_limit",
    value: 40,
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 63).toISOString(), // 63 days ago
  },
  {
    id: 10,
    location: {
      lat: 41.299,
      lng: 69.253,
    },
    type: "no_u_turn",
    direction: "north",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(), // 70 days ago
  },
];

// Road sign type definitions with display names and image paths
const roadSignTypes = {
  speed_limit: {
    name: "Speed Limit",
    description: "Maximum speed allowed",
    image: "/images/road-signs/speed-limit.svg",
  },
  stop: {
    name: "Stop",
    description: "Stop completely before proceeding",
    image: "/images/road-signs/stop.svg",
  },
  yield: {
    name: "Yield",
    description: "Give way to other traffic",
    image: "/images/road-signs/yield.svg",
  },
  no_entry: {
    name: "No Entry",
    description: "Entry prohibited for all vehicles",
    image: "/images/road-signs/no-entry.svg",
  },
  no_parking: {
    name: "No Parking",
    description: "Parking prohibited",
    image: "/images/road-signs/no-parking.svg",
  },
  no_overtaking: {
    name: "No Overtaking",
    description: "Overtaking prohibited",
    image: "/images/road-signs/no-overtaking.svg",
  },
  pedestrian_crossing: {
    name: "Pedestrian Crossing",
    description: "Pedestrian crossing ahead",
    image: "/images/road-signs/pedestrian-crossing.svg",
  },
  traffic_light: {
    name: "Traffic Light",
    description: "Traffic light ahead",
    image: "/images/road-signs/traffic-light.svg",
  },
  no_u_turn: {
    name: "No U-Turn",
    description: "U-turns prohibited",
    image: "/images/road-signs/no-u-turn.svg",
  },
};

/**
 * Custom hook for managing road signs data
 * @returns {Object} Functions and state for road signs data management
 */
export const useRoadSigns = () => {
  const [roadSignsData, setRoadSignsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoadSign, setSelectedRoadSign] = useState(null);
  const [lastSuccessFullLocation, setLastSuccessFullLocation] = useState(null);
  const lastLocationRef = useRef(null);

  const [filters, setFilters] = useState({
    types: {
      speed_limit: true,
      stop: true,
      yield: true,
      no_entry: true,
      no_parking: true,
      no_overtaking: true,
      pedestrian_crossing: true,
      traffic_light: true,
      no_u_turn: true,
    },
    status: {
      active: true,
      maintenance: true,
      planned: true,
    },
  });

  // Move toRadians function outside to prevent recreation on each call
  const toRadians = (degrees) => (Number(degrees) * Math.PI) / 180;

  // Fetch road signs data
  const fetchRoadSignsData = useCallback(
    async (body) => {
      setIsLoading(true);
      setError(null);

      const newLocation = { lat: body.lat, lng: body.lng };

      // Use the ref instead of state for immediate access
      if (lastLocationRef.current) {
        const lat1 = toRadians(newLocation.lat);
        const lat2 = toRadians(lastLocationRef.current.lat);
        const lng1 = toRadians(newLocation.lng);
        const lng2 = toRadians(lastLocationRef.current.lng);

        // Haversine formula
        const R = 6371000; // Earth's radius in meters
        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < 100) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const res = await getNearbySigns(body);
        setRoadSignsData(res.data);
        // Update both state and ref
        setLastSuccessFullLocation(newLocation);
        lastLocationRef.current = newLocation;
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching road signs data:", err);
        setError("Failed to fetch road signs data");
        setIsLoading(false);
      }
    },
    [toRadians] // Remove lastSuccessFullLocation from dependencies
  );

  useEffect(() => {
    if (lastSuccessFullLocation) {
      lastLocationRef.current = lastSuccessFullLocation;
    }
  }, [lastSuccessFullLocation]);

  // Clear road signs data
  const clearRoadSignsData = useCallback(() => {
    setRoadSignsData([]);
    setSelectedRoadSign(null);
  }, []);

  // Select a specific road sign
  const selectRoadSign = useCallback((roadSign) => {
    setSelectedRoadSign(roadSign);
  }, []);

  // Clear selected road sign
  const clearSelectedRoadSign = useCallback(() => {
    setSelectedRoadSign(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Toggle a specific type filter
  const toggleTypeFilter = useCallback((signType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      types: {
        ...prevFilters.types,
        [signType]: !prevFilters.types[signType],
      },
    }));
  }, []);

  // Toggle a specific status filter
  const toggleStatusFilter = useCallback((status) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: {
        ...prevFilters.status,
        [status]: !prevFilters.status[status],
      },
    }));
  }, []);

  // Get filtered road signs based on current filters
  const getFilteredRoadSigns = useCallback(() => {
    return roadSignsData.filter((sign) => {
      // Filter by type
      if (!filters.types[sign.type]) return false;

      // Filter by status
      if (!filters.status[sign.status]) return false;

      return true;
    });
  }, [roadSignsData, filters]);

  return {
    roadSignsData,
    isLoading,
    error,
    selectedRoadSign,
    filters,
    roadSignTypes,
    fetchRoadSignsData,
    clearRoadSignsData,
    selectRoadSign,
    clearSelectedRoadSign,
    updateFilters,
    toggleTypeFilter,
    toggleStatusFilter,
    getFilteredRoadSigns,
  };
};
