import { useEffect, useState } from "react";
import { getErrorHistory } from "../api/api.handlers";

// Custom hook for fetching and sorting data
const useSensorErrorHistory = (deviceId, sensorId) => {
  const [errorHistory, setErrorHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
    try {
      const data = { type: 3, device_id: deviceId, sensor_id: sensorId };
      const res = await getErrorHistory(1, data);
      setErrorHistory(res.data);
    } catch (error) {
      console.error("Error fetching error history:", error);
    }
  };

  return { errorHistory, filteredData };
};

export default useSensorErrorHistory;
