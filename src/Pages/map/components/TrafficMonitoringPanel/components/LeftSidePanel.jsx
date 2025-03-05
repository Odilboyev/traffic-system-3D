import React from "react";
import SlidePanel from "../../../../../components/SlidePanel/SlidePanel";
import TopCrossroadsContent from "./TopCrossroadsContent";
import TrafficRatingContent from "./TrafficRatingContent";
import TrafficVolumeStatsCard from "./TrafficVolumeStatsCard";
import TransportStatsCard from "./TransportStatsCard";
import { useModule } from "../../../context/ModuleContext";

// Import module-specific components
import TransportModule from "./modules/TransportModule";
import FuelStationsModule from "./modules/FuelStationsModule";
import WeatherModule from "./modules/WeatherModule";

const LeftSidePanel = () => {
  const { activeModule } = useModule();
  // Render different content based on active module
  const renderModuleContent = () => {
    switch (activeModule?.id) {
      case 'transport':
        return (
          <>
            {/* Top Crossroads Panel */}
            <TopCrossroadsContent />

            {/* Traffic Rating Panel */}
            <TrafficRatingContent />

            <div className="w-3/4">
              {/* Traffic Volume Stats Panel */}
              <TrafficVolumeStatsCard />

              {/* Transport Stats Panel */}
              <TransportStatsCard />
            </div>
            <TransportModule />
          </>
        );
      case 'fuel':
        return <FuelStationsModule />;
      case 'weather':
        return <WeatherModule />;
      default:
        return (
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
            <p className="text-cyan-100">Please select a module</p>
          </div>
        );
    }
  };

  return (
    <div className="left-side-panels h-full max-h-full overflow-y-auto max-w-[30vw] scrollbar-hide space-y-4">
      {renderModuleContent()}
    </div>
  );
};

export default LeftSidePanel;
