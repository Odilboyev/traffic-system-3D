import {
  getBusLines,
  getBusRealtimeLocations,
} from "../../../api/api.handlers";
import { useCallback, useEffect, useState } from "react";

// Transport types
const transportTypes = {
  BUS: "bus",
};

// Initial empty state
const emptyState = {
  routes: [],
  vehicles: [],
  viewportVehicles: [],
};

/**
 * Custom hook for managing public transport data
 * @returns {Object} Functions and state for public transport data management
 */
export const usePublicTransport = () => {
  const [transportData, setTransportData] = useState(emptyState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentViewport, setCurrentViewport] = useState(null);
  const [realtimeVehicles, setRealtimeVehicles] = useState([]);
  const [filters, setFilters] = useState({
    [transportTypes.BUS]: false,
  });

  // Fetch transport data
  const fetchTransportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const busLines = await getBusLines();

      // Transform the data to match our expected format
      // Create two routes for each bus line (outbound and return)
      const transformedData = {
        routes: busLines
          .flatMap((route) => [
            {
              id: `${route.route_id}-1`,
              name: `${route.name} (Outbound)`,
              type: transportTypes.BUS,
              color: "#3b82f6", // Blue for outbound
              path: route.route_lines_one,
              originalId: route.route_id,
            },
            {
              id: `${route.route_id}-2`,
              name: `${route.name} (Return)`,
              type: transportTypes.BUS,
              color: "#ef4444", // Red for return
              path: route.route_lines_two,
              originalId: route.route_id,
            },
          ])
          .filter(
            (route) => Array.isArray(route.path) && route.path.length > 0
          ), // Filter out routes with empty paths
        vehicles: [], // We'll add real-time vehicle data when available
      };

      setTransportData(transformedData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching transport data:", err);
      setError("Failed to fetch transport data");
      setIsLoading(false);
    }
  }, []);

  const fetchRealtimeVehicles = useCallback(async (body) => {
    try {
      const vehicles = await getBusRealtimeLocations(body);
      console.table(vehicles, "Realtime vehicles");
      setRealtimeVehicles(vehicles);
      setTransportData((prev) => ({
        ...prev,
        vehicles: vehicles,
      }));
    } catch (err) {
      console.error("Error fetching realtime vehicles:", err);
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

  // Update viewport and fetch bus locations
  const updateViewport = useCallback(async (viewport) => {
    setCurrentViewport(viewport);
    try {
      const locations = await getBusRealtimeLocations({
        viewport,
        type: "online5",
        immersive: false,
      });
      // locations is an array of bus locations
      if (!Array.isArray(locations)) {
        console.error("Expected array of locations but got:", locations);
        return;
      }

      setTransportData((prev) => {
        // If no previous vehicles, use the new locations array
        if (!prev.viewportVehicles?.length) {
          return {
            ...prev,
            viewportVehicles: locations,
          };
        }

        // Create a map of existing vehicles by bus_name for faster lookup
        const existingVehicles = new Map(
          prev.viewportVehicles.map((v) => [v.bus_name, v])
        );

        // Update existing vehicles and add new ones
        locations.forEach((newVehicle) => {
          existingVehicles.set(newVehicle.bus_name, newVehicle);
        });

        return {
          ...prev,
          viewportVehicles: Array.from(existingVehicles.values()),
        };
      });
    } catch (err) {
      console.error("Error fetching viewport vehicles:", err);
    }
  }, []);

  // Auto-update viewport vehicles
  useEffect(() => {
    console.log("Current viewport:", currentViewport);
    if (currentViewport) {
      const updateLocations = async () => {
        try {
          const locations = await getBusRealtimeLocations({
            viewport: currentViewport,
            type: "online5",
            immersive: false,
          });
          // locations is an array of bus locations
          if (!Array.isArray(locations)) {
            console.error("Expected array of locations but got:", locations);
            return;
          }

          setTransportData((prev) => {
            // If no previous vehicles, use the new locations array
            if (!prev.viewportVehicles?.length) {
              return {
                ...prev,
                viewportVehicles: locations,
              };
            }

            // Create a map of existing vehicles by bus_name for faster lookup
            const existingVehicles = new Map(
              prev.viewportVehicles.map((v) => [v.bus_name, v])
            );

            // Update existing vehicles and add new ones
            locations.forEach((newVehicle) => {
              existingVehicles.set(newVehicle.bus_name, newVehicle);
            });

            return {
              ...prev,
              viewportVehicles: Array.from(existingVehicles.values()),
            };
          });
        } catch (err) {
          console.error("Error updating viewport vehicles:", err);
        }
      };

      // Update every 30 seconds
      const interval = setInterval(updateLocations, 30000);
      return () => clearInterval(interval);
    }
  }, [currentViewport]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Toggle a specific filter
  const toggleFilter = useCallback((filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: !prevFilters[filterType],
    }));
  }, []);

  // Get filtered routes based on current filters
  const getFilteredRoutes = useCallback(() => {
    return transportData.routes.filter((route) => filters[route.type]);
  }, [transportData.routes, filters]);

  // Get filtered vehicles based on current filters
  const getFilteredVehicles = useCallback(() => {
    return transportData.vehicles.filter((vehicle) => {
      // Find the route this vehicle belongs to
      const route = transportData.routes.find((r) => r.id === vehicle.routeId);
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
    getFilteredVehicles,
    updateViewport,
    fetchRealtimeVehicles,
    currentViewport,
  };
};
