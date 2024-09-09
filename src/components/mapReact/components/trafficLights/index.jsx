import { memo } from "react";
import RoadCanvas from "../canvasLights";
import CrossroadVisualization from "./d3Road";
import CrossroadByDiv from "./roadByDiv";
// import RoadDrawing from "../../../canvasRoad/canvasVersion";
import RoadDrawing from "../../../canvasRoad";
const TrafficLights = () => {
  return (
    <div>
      <RoadDrawing />
    </div>
  );
};

export default memo(TrafficLights);
