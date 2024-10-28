import { getLaneWidth } from "../utils";
import ArrowDisplay from "./arrowDisplay";

const Lane = ({
  angle,
  lanesLeft,
  lanesRight,
  direction,
  roadName = "",
  trafficLights,
  seconds, // Add seconds prop
}) => {
  const totalLanes = lanesLeft.length + lanesRight.length;
  const laneWidth = getLaneWidth();

  const getColorClass = (status) => {
    const colorMap = {
      red: "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
      yellow: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
      green: "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]",
    };
    return colorMap[status] || colorMap.red;
  };

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
          seconds={seconds}
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
          seconds={seconds}
        />
      ))}
    </div>
  );
};

export default Lane;
