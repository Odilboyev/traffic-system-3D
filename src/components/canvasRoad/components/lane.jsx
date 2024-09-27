import { getLaneWidth } from "../utils";
import ArrowDisplay from "./arrowDisplay";
const Lane = ({
  lanesLeft,
  lanesRight,
  direction,
  roadName = "",
  trafficLights,
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
                : "flex-row "
            }`
      } ${direction === "vertical" ? "justify-center" : "items-center"}`}
      style={{
        width:
          direction === "vertical" ? `${laneWidth * totalLanes}px` : "100%",
        height:
          direction === "horizontal" ? `${laneWidth * totalLanes}px` : "100%",
      }}
    >
      <p
        className={`text-xl font-bold absolute ${
          roadName === "north" || roadName === "south"
            ? "-left-20 top-10"
            : "-top-10"
        }`}
      >
        {roadName}
      </p>
      {lanesLeft.map((lane, i) => (
        <ArrowDisplay
          key={`left-${i}`}
          left={true}
          direction={direction}
          laneWidth={laneWidth}
          totalLanes={totalLanes}
          laneIndex={i}
          icon={lane.icon}
          roadName={roadName}
          trafficLights={trafficLights}
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
          icon={lane.icon}
          roadName={roadName}
          trafficLights={trafficLights}
        />
      ))}
    </div>
  );
};

export default Lane;
