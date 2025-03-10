import { useCallback, useState } from "react";

// Mock monitoring data - in a real app, this would come from an API
const mockMonitoringData = [
  {
    id: 1,
    location: {
      lat: 41.3110,
      lng: 69.2400
    },
    type: "camera",
    name: "Camera #001",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    details: {
      model: "Hikvision DS-2CD2T85G1-I5",
      resolution: "4K",
      angle: 120,
      coverage: "Wide",
      nightVision: true
    },
    metrics: {
      vehicleCount: 245,
      averageSpeed: 42,
      congestionLevel: "low"
    }
  },
  {
    id: 2,
    location: {
      lat: 41.3050,
      lng: 69.2450
    },
    type: "sensor",
    name: "Traffic Sensor #002",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    details: {
      model: "TrafficSense TS-200",
      type: "Inductive Loop",
      range: 50,
      accuracy: "High"
    },
    metrics: {
      vehicleCount: 178,
      averageSpeed: 38,
      congestionLevel: "medium"
    }
  },
  {
    id: 3,
    location: {
      lat: 41.3000,
      lng: 69.2500
    },
    type: "camera",
    name: "Camera #003",
    status: "maintenance",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    details: {
      model: "Dahua IPC-HFW4631H-ZSA",
      resolution: "2K",
      angle: 90,
      coverage: "Medium",
      nightVision: true
    },
    metrics: {
      vehicleCount: 0,
      averageSpeed: 0,
      congestionLevel: "unknown"
    }
  },
  {
    id: 4,
    location: {
      lat: 41.2950,
      lng: 69.2550
    },
    type: "sensor",
    name: "Traffic Sensor #004",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    details: {
      model: "TrafficSense TS-300",
      type: "Radar",
      range: 100,
      accuracy: "Very High"
    },
    metrics: {
      vehicleCount: 312,
      averageSpeed: 35,
      congestionLevel: "high"
    }
  },
  {
    id: 5,
    location: {
      lat: 41.3080,
      lng: 69.2350
    },
    type: "camera",
    name: "Camera #005",
    status: "active",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
    details: {
      model: "Axis P1448-LE",
      resolution: "4K",
      angle: 110,
      coverage: "Wide",
      nightVision: true
    },
    metrics: {
      vehicleCount: 156,
      averageSpeed: 45,
      congestionLevel: "low"
    }
  }
];

/**
 * Custom hook for managing traffic monitoring data
 * @returns {Object} Functions and state for monitoring data management
 */
export const useMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filters, setFilters] = useState({
    types: {
      camera: true,
      sensor: true
    },
    status: {
      active: true,
      maintenance: true,
      offline: true
    },
    congestion: {
      low: true,
      medium: true,
      high: true,
      unknown: true
    }
  });

  // Fetch monitoring data
  const fetchMonitoringData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use the mock data with a delay to simulate network request
      setTimeout(() => {
        setMonitoringData(mockMonitoringData);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching monitoring data:", err);
      setError("Failed to fetch monitoring data");
      setIsLoading(false);
    }
  }, []);

  // Clear monitoring data
  const clearMonitoringData = useCallback(() => {
    setMonitoringData([]);
    setSelectedDevice(null);
  }, []);

  // Select a specific device
  const selectDevice = useCallback((device) => {
    setSelectedDevice(device);
  }, []);

  // Clear selected device
  const clearSelectedDevice = useCallback(() => {
    setSelectedDevice(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Toggle a specific type filter
  const toggleTypeFilter = useCallback((deviceType) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      types: {
        ...prevFilters.types,
        [deviceType]: !prevFilters.types[deviceType]
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

  // Toggle a specific congestion filter
  const toggleCongestionFilter = useCallback((congestion) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      congestion: {
        ...prevFilters.congestion,
        [congestion]: !prevFilters.congestion[congestion]
      }
    }));
  }, []);

  // Get filtered monitoring devices based on current filters
  const getFilteredDevices = useCallback(() => {
    return monitoringData.filter(device => {
      // Filter by type
      if (!filters.types[device.type]) return false;
      
      // Filter by status
      if (!filters.status[device.status]) return false;
      
      // Filter by congestion level
      if (!filters.congestion[device.metrics.congestionLevel]) return false;
      
      return true;
    });
  }, [monitoringData, filters]);

  // Get congestion statistics
  const getCongestionStats = useCallback(() => {
    const stats = {
      low: 0,
      medium: 0,
      high: 0,
      unknown: 0,
      total: 0
    };

    monitoringData.forEach(device => {
      if (device.status === 'active') {
        stats[device.metrics.congestionLevel]++;
        stats.total++;
      }
    });

    return stats;
  }, [monitoringData]);

  // Get total vehicle count
  const getTotalVehicleCount = useCallback(() => {
    return monitoringData.reduce((total, device) => {
      if (device.status === 'active') {
        return total + device.metrics.vehicleCount;
      }
      return total;
    }, 0);
  }, [monitoringData]);

  // Get average vehicle speed
  const getAverageVehicleSpeed = useCallback(() => {
    const activeDevices = monitoringData.filter(device => device.status === 'active');
    if (activeDevices.length === 0) return 0;
    
    const totalSpeed = activeDevices.reduce((total, device) => {
      return total + device.metrics.averageSpeed;
    }, 0);
    
    return Math.round(totalSpeed / activeDevices.length);
  }, [monitoringData]);

  return {
    monitoringData,
    isLoading,
    error,
    selectedDevice,
    filters,
    fetchMonitoringData,
    clearMonitoringData,
    selectDevice,
    clearSelectedDevice,
    updateFilters,
    toggleTypeFilter,
    toggleStatusFilter,
    toggleCongestionFilter,
    getFilteredDevices,
    getCongestionStats,
    getTotalVehicleCount,
    getAverageVehicleSpeed
  };
};
