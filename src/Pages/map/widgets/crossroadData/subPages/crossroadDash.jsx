import React, { useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";
import { getCrossRoadStats } from "../../../../../api/api.handlers";
import CrossroadStats from "./newChart";

const CrossroadDashboard = ({ marker }) => {
  const [crossroadStats, setCrossroadStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await getCrossRoadStats({ crossroad_id: marker?.cid });
        setCrossroadStats(response);
      } catch (error) {
        console.error("Error fetching crossroad stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (marker?.cid) {
      fetchStats();
    }
  }, [marker]);

  return (
    <div>
      {crossroadStats ? (
        <CrossroadStats crossroadStats={crossroadStats} />
      ) : isLoading ? (
        <p>
          <TbLoader className="animate animate-spin" /> Loading...
        </p>
      ) : (
        <p>No stats found</p>
      )}
    </div>
  );
};

export default CrossroadDashboard;
