import ArrowDisplay from "./arrowDisplay";
import { getLaneWidth } from "../utils";

const Lane = ({
  angle,
  lanesLeft,
  lanesRight,
  direction,
  roadName = "",
  trafficLights,
  seconds,
}) => {
  const totalLanes = lanesLeft.length + lanesRight.length;
  const laneWidth = getLaneWidth();

  return (
    <div
      className={`relative z-20 flex ${
        direction === "horizontal"
          ? `${
              roadName.toLowerCase() === "east"
                ? "flex-col-reverse"
                : "flex-col"
            }`
          : `${
              roadName.toLowerCase() === "north"
                ? "flex-row-reverse"
                : "flex-row"
            }`
      } ${direction === "vertical" ? "justify-center" : "items-center"}`}
      style={{
        width:
          direction === "vertical" ? `${laneWidth * totalLanes}px` : "100%",
        height:
          direction === "horizontal" ? `${laneWidth * totalLanes}px` : "100%",
      }}
    >
      {lanesLeft.map((lane, i) => (
        <ArrowDisplay
          key={`left-${i}`}
          left={true}
          direction={direction}
          laneWidth={laneWidth}
          totalLanes={totalLanes}
          laneIndex={i}
          roadName={roadName}
          trafficLights={trafficLights}
          seconds={seconds?.[lane?.channel_id]}
          channelId={lane?.channel_id}
          icon={lane?.icon}
        />
      ))}
      {lanesRight.map((lane, i) => (
        <ArrowDisplay
          key={`right-${i}`}
          right={true}
          direction={direction}
          laneWidth={laneWidth}
          totalLanes={totalLanes}
          laneIndex={i + lanesLeft.length}
          icon={lane?.icon}
          roadName={roadName}
          trafficLights={trafficLights}
          seconds={seconds?.[lane?.channel_id]}
          channelId={lane?.channel_id}
        />
      ))}
    </div>
  );
};

export default Lane;
