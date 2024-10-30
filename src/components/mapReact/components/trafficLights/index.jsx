import { memo } from "react";
import RoadDrawing from "../drawnRoad";
// import RoadDrawing from "../../../canvasRoad/canvasVersion";
const TrafficLights = ({ id, isInModal }) => {
  return (
    <>
      <RoadDrawing id={id} isInModal={isInModal} />
    </>
  );
};

export default memo(TrafficLights);
