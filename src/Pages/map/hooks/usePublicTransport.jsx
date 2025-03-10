import { useCallback, useState } from "react";

// Mock transport types
const transportTypes = {
  BUS: "bus",
  METRO: "metro",
  TRAM: "tram",
};

// Mock public transport data - in a real app, this would come from an API
const mockTransportData = {
  routes: [
    {
      id: 1,
      name: "Bus 51",
      type: transportTypes.BUS,
      color: "#3b82f6",
      path: [
        [69.2401, 41.2995],
        [69.2450, 41.3010],
        [69.2500, 41.3050],
        [69.2550, 41.3080],
        [69.2600, 41.3100],
        [69.2650, 41.3120],
      ],
      stops: [
        { id: 1, name: "Central Station", coordinates: [69.2401, 41.2995] },
        { id: 2, name: "Market Square", coordinates: [69.2500, 41.3050] },
        { id: 3, name: "City Park", coordinates: [69.2650, 41.3120] },
      ]
    },
    {
      id: 2,
      name: "Bus 76",
      type: transportTypes.BUS,
      color: "#3b82f6",
      path: [
        [69.2300, 41.2900],
        [69.2350, 41.2950],
        [69.2400, 41.3000],
        [69.2450, 41.3050],
        [69.2500, 41.3100],
      ],
      stops: [
        { id: 4, name: "South Terminal", coordinates: [69.2300, 41.2900] },
        { id: 5, name: "University", coordinates: [69.2400, 41.3000] },
        { id: 6, name: "Hospital", coordinates: [69.2500, 41.3100] },
      ]
    },
    {
      id: 3,
      name: "Metro Line 1",
      type: transportTypes.METRO,
      color: "#ef4444",
      path: [
        [69.2200, 41.2800],
        [69.2300, 41.2850],
        [69.2400, 41.2900],
        [69.2500, 41.2950],
        [69.2600, 41.3000],
      ],
      stops: [
        { id: 7, name: "Chorsu", coordinates: [69.2200, 41.2800] },
        { id: 8, name: "Gafur Gulom", coordinates: [69.2400, 41.2900] },
        { id: 9, name: "Amir Temur", coordinates: [69.2600, 41.3000] },
      ]
    },
    {
      id: 4,
      name: "Tram 10",
      type: transportTypes.TRAM,
      color: "#10b981",
      path: [
        [69.2700, 41.2700],
        [69.2650, 41.2750],
        [69.2600, 41.2800],
        [69.2550, 41.2850],
        [69.2500, 41.2900],
      ],
      stops: [
        { id: 10, name: "East District", coordinates: [69.2700, 41.2700] },
        { id: 11, name: "Science Academy", coordinates: [69.2600, 41.2800] },
        { id: 12, name: "Sports Complex", coordinates: [69.2500, 41.2900] },
      ]
    },
  ],
  vehicles: [
    {
      id: 101,
      routeId: 1,
      type: transportTypes.BUS,
      coordinates: [69.2500, 41.3050],
      heading: 45,
      speed: 25,
      occupancy: "medium", // low, medium, high
      onTime: true,
      nextStop: "City Park",
      delayMinutes: 0
    },
    {
      id: 102,
      routeId: 1,
      type: transportTypes.BUS,
      coordinates: [69.2401, 41.2995],
      heading: 45,
      speed: 0,
      occupancy: "high",
      onTime: true,
      nextStop: "Market Square",
      delayMinutes: 0
    },
    {
      id: 103,
      routeId: 2,
      type: transportTypes.BUS,
      coordinates: [69.2400, 41.3000],
      heading: 90,
      speed: 20,
      occupancy: "low",
      onTime: false,
      nextStop: "Hospital",
      delayMinutes: 5
    },
    {
      id: 104,
      routeId: 3,
      type: transportTypes.METRO,
      coordinates: [69.2400, 41.2900],
      heading: 45,
      speed: 40,
      occupancy: "medium",
      onTime: true,
      nextStop: "Amir Temur",
      delayMinutes: 0
    },
    {
      id: 105,
      routeId: 4,
      type: transportTypes.TRAM,
      coordinates: [69.2600, 41.2800],
      heading: 270,
      speed: 15,
      occupancy: "low",
      onTime: true,
      nextStop: "Sports Complex",
      delayMinutes: 2
    },
  ]
};

/**
 * Custom hook for managing public transport data
 * @returns {Object} Functions and state for public transport data management
 */
export const usePublicTransport = () => {
  const [transportData, setTransportData] = useState({ routes: [], vehicles: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({
    [transportTypes.BUS]: true,
    [transportTypes.METRO]: true,
    [transportTypes.TRAM]: true,
  });

  // Fetch transport data
  const fetchTransportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use the mock data with a delay to simulate network request
      setTimeout(() => {
        setTransportData(mockTransportData);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching transport data:", err);
      setError("Failed to fetch transport data");
      setIsLoading(false);
    }
  }, []);

  // Clear transport data
  const clearTransportData = useCallback(() => {
    setTransportData({ routes: [], vehicles: [] });
    setSelectedRoute(null);
    setSelectedVehicle(null);
  }, []);

  // Select a specific route
  const selectRoute = useCallback((route) => {
    setSelectedRoute(route);
  }, []);

  // Clear selected route
  const clearSelectedRoute = useCallback(() => {
    setSelectedRoute(null);
  }, []);

  // Select a specific vehicle
  const selectVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
  }, []);

  // Clear selected vehicle
  const clearSelectedVehicle = useCallback(() => {
    setSelectedVehicle(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Toggle a specific filter
  const toggleFilter = useCallback((filterType) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: !prevFilters[filterType]
    }));
  }, []);

  // Get filtered routes based on current filters
  const getFilteredRoutes = useCallback(() => {
    return transportData.routes.filter(route => filters[route.type]);
  }, [transportData.routes, filters]);

  // Get filtered vehicles based on current filters
  const getFilteredVehicles = useCallback(() => {
    return transportData.vehicles.filter(vehicle => {
      // Find the route this vehicle belongs to
      const route = transportData.routes.find(r => r.id === vehicle.routeId);
      // Only include if the route type is in the active filters
      return route && filters[route.type];
    });
  }, [transportData.vehicles, transportData.routes, filters]);

  return {
    transportData,
    isLoading,
    error,
    selectedRoute,
    selectedVehicle,
    filters,
    transportTypes,
    fetchTransportData,
    clearTransportData,
    selectRoute,
    clearSelectedRoute,
    selectVehicle,
    clearSelectedVehicle,
    updateFilters,
    toggleFilter,
    getFilteredRoutes,
    getFilteredVehicles
  };
};
