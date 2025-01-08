import { getCurrentAlarms } from "../../../api/api.handlers";
import { useState } from "react";

export const useMapAlarms = () => {
  const [currentAlarms, setCurrentAlarms] = useState(null);
  const [isAlarmsOpen, setIsAlarmsOpen] = useState(false);

  const fetchAlarmsData = async () => {
    try {
      const alarmsRes = await getCurrentAlarms();
      setCurrentAlarms(alarmsRes.data);
    } catch (error) {
      console.error("Error fetching alarms:", error);
      throw new Error(error);
    }
  };

  return {
    currentAlarms,
    isAlarmsOpen,
    setIsAlarmsOpen,
    fetchAlarmsData,
  };
};
