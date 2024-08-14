import { memo } from "react";
import RoadCanvas from "../canvasLights";
import CrossroadVisualization from "./d3Road";
import CrossroadByDiv from "./roadByDiv";
const TrafficLights = () => {
  return (
    <div>
      <CrossroadByDiv />
    </div>
  );
};

export default memo(TrafficLights);
