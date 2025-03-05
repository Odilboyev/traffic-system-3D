import HourlyTrafficChartContent from "./HourlyTrafficChartContent";
import SpeedChartContent from "./SpeedChartContent";
import { speedStats } from "../data";
const RightSidePanel = () => {
  return (
    <div className="right-side-panels h-full max-h-full overflow-y-scroll max-w-[30vw] scrollbar-hide">
      <SpeedChartContent speedStats={speedStats} />

      {/* Hourly Traffic Chart Panel */}
      <HourlyTrafficChartContent />
    </div>
  );
};

export default RightSidePanel;
