import { useEffect, useState } from "react";

import { getFineStats } from "../../../../api/api.handlers";
import { useMapContext } from "../../context/MapContext";

const FinesStats = () => {
  const [stats, setStats] = useState(null);
  const { map } = useMapContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getFineStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching fine stats:", error);
      }
    };

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFlyTo = (lat, lng) => {
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 2000,
    });
  };

  if (!stats) return null;

  return (
    <div className="absolute left-4 top-[12%] w-[25vw] z-50 backdrop-blur-[2px] bg-gradient-to-r from-black/20 to-black/0">
      {/* Today's Total Violations */}
      <div className="my-4">
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
          <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
            <span className="text-teal-500/50">|</span>
            Бугунги жами қоидабузарликлар
            <span className="text-teal-500/50">|</span>
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
        <div className="text-4xl font-bold text-teal-300 text-center drop-shadow-[0_0_10px_rgba(45,212,191,0.3)] bg-black/20 py-4 rounded-lg backdrop-blur">
          {stats.widget1.count_all_today.toLocaleString()}
        </div>
      </div>

      {/* Top Violations */}
      <div className="mb-8">
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
          <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
            <span className="text-teal-500/50">|</span>
            Асосий қоидабузарликлар
            <span className="text-teal-500/50">|</span>
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
        <div className="space-y-2 max-h-[25vh] overflow-y-scroll scrollbar-hide bg-black/20 p-2 rounded-lg backdrop-blur">
          {stats.widget1.count_by_cat_today.map((violation, idx) => (
            <div
              key={violation.violation_code}
              className="flex items-center justify-between gap-3 text-sm p-3 hover:bg-white/10 transition-all duration-300 rounded-lg group border border-transparent hover:border-teal-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors min-w-[24px]">
                  {idx + 1}.
                </span>
                <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                  {violation.name}
                </span>
              </div>
              <span className="text-teal-300 group-hover:text-teal-200 transition-colors font-medium bg-black/30 px-3 py-1 rounded-full">
                {violation.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div>
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
          <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
            <span className="text-teal-500/50">|</span>
            Асосий ҳудудлар
            <span className="text-teal-500/50">|</span>
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
        <div className="space-y-2 max-h-[30vh] overflow-y-scroll scrollbar-hide bg-black/20 p-4 rounded-lg backdrop-blur">
          {stats.widget2.map((location, idx) => (
            <div
              key={location.crossroad_id}
              className="flex items-center justify-between gap-3 text-sm p-2 hover:bg-white/10 transition-all duration-300 rounded-lg group cursor-pointer border border-transparent hover:border-teal-500/20"
              onClick={() =>
                handleFlyTo(
                  parseFloat(location.crossroad_location_lat),
                  parseFloat(location.crossroad_location_lng)
                )
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors min-w-[24px]">
                  {idx + 1}.
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                    {location.crossroad_name}
                  </span>
                  <span className="text-xs text-teal-300 group-hover:text-white transition-colors">
                    {location.crossroad_region_name}
                  </span>
                </div>
              </div>
              <span className="text-teal-300 group-hover:text-teal-200 transition-colors font-medium bg-black/30 px-3 py-1 rounded-full">
                {location.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinesStats;
