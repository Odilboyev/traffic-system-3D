import ArrowDisplay from "./arrowDisplay";

const Lane = ({ lanesFrom, lanesTo, direction, roadName, trafficLights }) => {
  const totalLanes = lanesFrom + lanesTo;
  const laneWidth = 40;

  return (
    <div
      className={`relative z-20 flex ${
        direction === "horizontal" ? "flex-col" : "flex-row"
      }`}
      style={{
        width:
          direction === "vertical" ? `${laneWidth * totalLanes}px` : "100%",
        height:
          direction === "horizontal" ? `${laneWidth * totalLanes}px` : "100%",
      }}
    >
      {Array.from({ length: totalLanes }).map((_, i) => (
        <ArrowDisplay
          key={i}
          direction={direction}
          laneWidth={laneWidth}
          laneIndex={i}
          totalLanes={totalLanes}
          lanesFrom={lanesFrom}
          lanesTo={lanesTo}
          roadName={roadName}
          trafficLights={trafficLights}
        />
      ))}
    </div>
  );
};

export default Lane;
