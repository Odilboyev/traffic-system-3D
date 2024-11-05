import { useEffect, useState } from "react";
import { getErrorHistory } from "../api/api.handlers";

// Custom hook for fetching and sorting data
const useSensorErrorHistory = (deviceId, sensorId) => {
  const [errorHistory, setErrorHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (sensorId) {
      fetchErrorHistory(sensorId);
    }
  }, [sensorId]);

  useEffect(() => {
    if (errorHistory?.length > 0) {
      setFilteredData(errorHistory);
    }
  }, [errorHistory]);

  const fetchErrorHistory = async (sensorId) => {
    setIsLoading(true);
    try {
      const data = { type: 3, device_id: deviceId, sensor_id: sensorId };
      const res = await getErrorHistory(1, data);
      setErrorHistory(res.data);
    } catch (error) {
      console.error("Error fetching error history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { errorHistory, filteredData, isLoading };
};

export default useSensorErrorHistory;
