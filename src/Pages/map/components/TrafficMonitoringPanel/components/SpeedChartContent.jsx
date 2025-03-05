import React from "react";
import SpeedStatsWidget from "../../SpeedStatsWidget";

const SpeedChartContent = ({ forwardedRef, speedStats }) => {
  return (
    <div
      ref={forwardedRef}
      className="flex-1 overflow-hidden max-w-[15vw] ml-auto"
    >
      <SpeedStatsWidget
        minSpeed={speedStats.min}
        avgSpeed={speedStats.avg}
        maxSpeed={speedStats.max}
      />
    </div>
  );
};

export default SpeedChartContent;
