import { memo } from "react";
import RoadCanvas from "../canvasLights";
const TrafficLights = () => {
  return (
    <div>
      <RoadCanvas />
    </div>
  );
};

export default memo(TrafficLights);
