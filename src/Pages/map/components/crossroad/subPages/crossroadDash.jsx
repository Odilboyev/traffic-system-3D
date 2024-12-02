import React, { useEffect, useState } from "react";

import CrossroadStats from "./newChart";
import { Spinner } from "@material-tailwind/react";
import { getCrossRoadStats } from "../../../../../api/api.handlers";

const CrossroadDashboard = ({ marker }) => {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const fetchStats = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await getCrossRoadStats({ crossroad_id: marker?.cid });
      setState(prev => ({
        ...prev,
        data: response,
        lastUpdated: new Date(),
        isLoading: false
      }));
    } catch (error) {
      console.error("Error fetching crossroad stats:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Failed to load crossroad statistics",
        isLoading: false
      }));
    }
  };

  useEffect(() => {
    if (marker?.cid) {
      fetchStats();
      // Set up auto-refresh every 5 minutes
      const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    }
  }, [marker?.cid]);

  const { data, isLoading, error, lastUpdated } = state;

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No statistics available for this crossroad
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Crossroad Statistics
        </h3>
        {lastUpdated && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <CrossroadStats crossroadStats={data} />
      
      {isLoading && (
        <div className="absolute top-2 right-2">
          <Spinner className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default CrossroadDashboard;
