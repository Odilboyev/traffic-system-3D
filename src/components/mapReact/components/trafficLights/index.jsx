import { memo } from "react";
import RoadCanvas from "../canvasLights";
import CrossroadVisualization from "./d3Road";
import CrossroadByDiv from "./roadByDiv";
import RoadDrawing from "../drawnRoad";
// import RoadDrawing from "../../../canvasRoad/canvasVersion";
const TrafficLights = ({ id }) => {
  return (
    <div>
      <RoadDrawing id={id} />
    </div>
  );
};

export default memo(TrafficLights);
