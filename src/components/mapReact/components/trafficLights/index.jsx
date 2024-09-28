import { memo } from "react";
import RoadCanvas from "../canvasLights";
import CrossroadVisualization from "./d3Road";
import CrossroadByDiv from "./roadByDiv";
import RoadDrawing from "../../../drawnRoad";
// import RoadDrawing from "../../../canvasRoad/canvasVersion";
const TrafficLights = () => {
  return (
    <div>
      <RoadDrawing />
    </div>
  );
};

export default memo(TrafficLights);
