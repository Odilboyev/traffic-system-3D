import { useCallback, useState } from "react";

// Mock road signs data - in a real app, this would come from an API
const mockRoadSignsData = [
  {
    id: 1,
    location: {
      lat: 41.3050,
      lng: 69.2480
    },
    type: "speed_limit",
    value: 60,
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
  },
  {
    id: 2,
    location: {
      lat: 41.3020,
      lng: 69.2520
    },
    type: "stop",
    direction: "north",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() // 14 days ago
  },
  {
    id: 3,
    location: {
      lat: 41.2980,
      lng: 69.2450
    },
    type: "no_entry",
    direction: "east",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString() // 21 days ago
  },
  {
    id: 4,
    location: {
      lat: 41.3070,
      lng: 69.2400
    },
    type: "yield",
    direction: "south",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString() // 28 days ago
  },
  {
    id: 5,
    location: {
      lat: 41.3000,
      lng: 69.2550
    },
    type: "no_parking",
    direction: "west",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString() // 35 days ago
  },
  {
    id: 6,
    location: {
      lat: 41.3040,
      lng: 69.2380
    },
    type: "no_overtaking",
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString() // 42 days ago
  },
  {
    id: 7,
    location: {
      lat: 41.2960,
      lng: 69.2500
    },
    type: "pedestrian_crossing",
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 49).toISOString() // 49 days ago
  },
  {
    id: 8,
    location: {
      lat: 41.3090,
      lng: 69.2470
    },
    type: "traffic_light",
    direction: "all",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 56).toISOString() // 56 days ago
  },
  {
    id: 9,
    location: {
      lat: 41.3010,
      lng: 69.2420
    },
    type: "speed_limit",
    value: 40,
    direction: "both",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 63).toISOString() // 63 days ago
  },
  {
    id: 10,
    location: {
      lat: 41.2990,
      lng: 69.2530
    },
    type: "no_u_turn",
    direction: "north",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString() // 70 days ago
  }
];

// Road sign type definitions with display names and image paths
const roadSignTypes = {
  speed_limit: {
    name: "Speed Limit",
    description: "Maximum speed allowed",
    image: "/images/road-signs/speed-limit.svg"
  },
  stop: {
    name: "Stop",
    description: "Stop completely before proceeding",
    image: "/images/road-signs/stop.svg"
  },
  yield: {
    name: "Yield",
    description: "Give way to other traffic",
    image: "/images/road-signs/yield.svg"
  },
  no_entry: {
    name: "No Entry",
    description: "Entry prohibited for all vehicles",
    image: "/images/road-signs/no-entry.svg"
  },
  no_parking: {
    name: "No Parking",
    description: "Parking prohibited",
    image: "/images/road-signs/no-parking.svg"
  },
  no_overtaking: {
    name: "No Overtaking",
    description: "Overtaking prohibited",
    image: "/images/road-signs/no-overtaking.svg"
  },
  pedestrian_crossing: {
    name: "Pedestrian Crossing",
    description: "Pedestrian crossing ahead",
    image: "/images/road-signs/pedestrian-crossing.svg"
  },
  traffic_light: {
    name: "Traffic Light",
    description: "Traffic light ahead",
    image: "/images/road-signs/traffic-light.svg"
  },
  no_u_turn: {
    name: "No U-Turn",
    description: "U-turns prohibited",
    image: "/images/road-signs/no-u-turn.svg"
  }
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
      no_u_turn: true
    },
    status: {
      active: true,
      maintenance: true,
      planned: true
    }
  });

  // Fetch road signs data
  const fetchRoadSignsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use the mock data with a delay to simulate network request
      setTimeout(() => {
        setRoadSignsData(mockRoadSignsData);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching road signs data:", err);
      setError("Failed to fetch road signs data");
      setIsLoading(false);
    }
  }, []);

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
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Toggle a specific type filter
  const toggleTypeFilter = useCallback((signType) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      types: {
        ...prevFilters.types,
        [signType]: !prevFilters.types[signType]
      }
    }));
  }, []);

  // Toggle a specific status filter
  const toggleStatusFilter = useCallback((status) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      status: {
        ...prevFilters.status,
        [status]: !prevFilters.status[status]
      }
    }));
  }, []);

  // Get filtered road signs based on current filters
  const getFilteredRoadSigns = useCallback(() => {
    return roadSignsData.filter(sign => {
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
    getFilteredRoadSigns
  };
};
