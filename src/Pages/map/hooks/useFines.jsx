import { useCallback, useEffect, useState } from "react";

import { getFineLastData } from "../../../api/api.handlers";

// Mock fines data - in a real app, this would come from an API
const mockFinesData = [
  {
    id: 1,
    location: {
      lat: 41.301,
      lng: 69.24,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    type: "speeding",
    speed: 85,
    speedLimit: 60,
    vehicle: {
      plate: "01A123BB",
      type: "car",
      color: "white",
      make: "Chevrolet",
      model: "Nexia",
    },
    fine: 250000,
    status: "pending",
    camera: {
      id: "CAM-001",
      type: "speed",
    },
    images: [
      "https://example.com/fine1-image1.jpg",
      "https://example.com/fine1-image2.jpg",
    ],
  },
  {
    id: 2,
    location: {
      lat: 41.295,
      lng: 69.245,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: "red_light",
    vehicle: {
      plate: "01B456CC",
      type: "car",
      color: "black",
      make: "Toyota",
      model: "Camry",
    },
    fine: 300000,
    status: "pending",
    camera: {
      id: "CAM-002",
      type: "traffic_light",
    },
    images: [
      "https://example.com/fine2-image1.jpg",
      "https://example.com/fine2-image2.jpg",
    ],
  },
  {
    id: 3,
    location: {
      lat: 41.305,
      lng: 69.235,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    type: "no_seatbelt",
    vehicle: {
      plate: "01C789DD",
      type: "car",
      color: "silver",
      make: "Hyundai",
      model: "Sonata",
    },
    fine: 150000,
    status: "pending",
    camera: {
      id: "CAM-003",
      type: "surveillance",
    },
    images: ["https://example.com/fine3-image1.jpg"],
  },
  {
    id: 4,
    location: {
      lat: 41.29,
      lng: 69.25,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    type: "wrong_lane",
    vehicle: {
      plate: "01D012EE",
      type: "truck",
      color: "blue",
      make: "Isuzu",
      model: "NPR",
    },
    fine: 200000,
    status: "pending",
    camera: {
      id: "CAM-004",
      type: "surveillance",
    },
    images: [
      "https://example.com/fine4-image1.jpg",
      "https://example.com/fine4-image2.jpg",
    ],
  },
  {
    id: 5,
    location: {
      lat: 41.31,
      lng: 69.255,
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    type: "parking",
    vehicle: {
      plate: "01E345FF",
      type: "car",
      color: "red",
      make: "Kia",
      model: "Rio",
    },
    fine: 100000,
    status: "pending",
    camera: {
      id: "CAM-005",
      type: "surveillance",
    },
    images: ["https://example.com/fine5-image1.jpg"],
  },
];

// Fine type definitions with display names and icons
const fineTypes = {
  speeding: {
    name: "Speeding",
    description: "Exceeding the speed limit",
    icon: "speed",
  },
  red_light: {
    name: "Red Light",
    description: "Running a red light",
    icon: "traffic_light",
  },
  no_seatbelt: {
    name: "No Seatbelt",
    description: "Driving without a seatbelt",
    icon: "seatbelt",
  },
  wrong_lane: {
    name: "Wrong Lane",
    description: "Driving in the wrong lane",
    icon: "lane",
  },
  parking: {
    name: "Illegal Parking",
    description: "Parking in a prohibited area",
    icon: "parking",
  },
};

/**
 * Custom hook for managing fines data
 * @returns {Object} Functions and state for fines data management
 */
export const useFines = () => {
  const [finesData, setFinesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFine, setSelectedFine] = useState(null);
  const [filters, setFilters] = useState({
    types: {
      speeding: true,
      red_light: true,
      no_seatbelt: true,
      wrong_lane: true,
      parking: true,
    },
    timeRange: {
      start: new Date(Date.now() - 1000 * 60 * 60 * 24), // Last 24 hours
      end: new Date(),
    },
    status: {
      pending: true,
      paid: true,
      appealed: true,
    },
  });

  // Clear fines data
  const clearFinesData = useCallback(() => {
    setFinesData([]);
    setSelectedFine(null);
  }, []);

  // Select a specific fine
  const selectFine = useCallback((fine) => {
    setSelectedFine(fine);
  }, []);

  // Clear selected fine
  const clearSelectedFine = useCallback(() => {
    setSelectedFine(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Toggle a specific type filter
  const toggleTypeFilter = useCallback((fineType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      types: {
        ...prevFilters.types,
        [fineType]: !prevFilters.types[fineType],
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

  // Set time range filter
  const setTimeRangeFilter = useCallback((start, end) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      timeRange: { start, end },
    }));
  }, []);

  // Get filtered fines based on current filters
  const getFilteredFines = useCallback(() => {
    return finesData.filter((fine) => {
      // Filter by type
      if (!filters.types[fine.type]) return false;

      // Filter by status
      if (!filters.status[fine.status]) return false;

      // Filter by time range
      const fineTime = new Date(fine.timestamp);
      if (
        fineTime < filters.timeRange.start ||
        fineTime > filters.timeRange.end
      )
        return false;

      return true;
    });
  }, [finesData, filters]);

  return {
    finesData,
    isLoading,
    error,
    selectedFine,
    filters,
    fineTypes,
    fetchFinesData,
    clearFinesData,
    selectFine,
    clearSelectedFine,
    updateFilters,
    toggleTypeFilter,
    toggleStatusFilter,
    setTimeRangeFilter,
    getFilteredFines,
  };
};
