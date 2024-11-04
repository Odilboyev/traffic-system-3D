import React, { useState, useEffect } from "react";
import CrossroadStats from "./newChart";
import { getCrossRoadStats } from "../../../../../api/api.handlers";
import { TbLoader } from "react-icons/tb";

const CrossroadDashboard = ({ marker }) => {
  const [crossroadStats, setCrossroadStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getCrossRoadStats({ crossroad_id: marker?.cid });
        setCrossroadStats(response);
      } catch (error) {
        console.error("Error fetching crossroad stats:", error);
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
      ) : (
        <p>
          <TbLoader className="animate animate-spin" /> Loading...
        </p>
      )}
    </div>
  );
};

export default CrossroadDashboard;
