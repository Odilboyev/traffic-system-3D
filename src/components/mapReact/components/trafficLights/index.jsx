import { memo } from "react";
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
