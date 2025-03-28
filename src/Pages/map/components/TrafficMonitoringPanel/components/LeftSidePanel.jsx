import FuelStationsModule from "./modules/FuelStationsModule";
import React from "react";
import SlidePanel from "../../../../../components/SlidePanel/SlidePanel";
import TopCrossroadsContent from "./TopCrossroadsContent";
import TrafficRatingContent from "./TrafficRatingContent";
import TrafficVolumeStatsCard from "./TrafficVolumeStatsCard";
// Import module-specific components
import TransportModule from "./modules/TransportModule";
import TransportStatsCard from "./TransportStatsCard";
import WeatherModule from "./modules/WeatherModule";
import ParkingLotsModule from "./modules/ParkingLotsModule";
import { useModuleContext } from "../../../context/ModuleContext";

const LeftSidePanel = ({ isOpen }) => {
  return (
    <div className="left-side-panels h-full max-h-full overflow-y-auto max-w-[30vw] scrollbar-hide space-y-4">
      <>
        {/* Top Crossroads Panel */}
        <TopCrossroadsContent isOpen={isOpen} />

        {/* Traffic Rating Panel */}
        <TrafficRatingContent />

        <div className="w-3/4">
          {/* Traffic Volume Stats Panel */}
          <TrafficVolumeStatsCard />

          {/* Transport Stats Panel */}
          {/* <TransportStatsCard /> */}
        </div>
        {/* <TransportModule /> */}
        <ParkingLotsModule />
      </>
    </div>
  );
};

export default LeftSidePanel;
