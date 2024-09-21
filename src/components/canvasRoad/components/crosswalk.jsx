import { getRoadWidth } from "../utils";

const Crosswalk = ({ crosswalkStatus, roadConfig, direction, roadName }) => {
  const crosswidth = 10; // Replace with your  if needed
  const crosswalkWidth = getRoadWidth(roadConfig); // Replace with getRoadWidth(roadConfig) if needed
  const crosswalkHeight = crosswidth / 2;

  let top, left;

  if (direction === "vertical") {
    top = roadName === "north" ? `calc(100% - ${crosswalkHeight}px)` : `0`;
    left = `calc(50% - ${crosswalkWidth / 2}px)`;
  } else {
    top = `calc(50% - ${crosswalkWidth / 2}px)`;
    left = roadName === "east" ? `0` : `calc(100% - ${crosswalkHeight}px)`;
  }
  const colorMappingBG = {
    green: "#4ade80",
    yellow: "#fde047",
    red: "#ef4444",
  };

  return (
    <div
      className={`absolute `}
      style={{
        width:
          direction === "vertical"
            ? `${crosswalkWidth}px`
            : `${crosswalkHeight}px`,
        height:
          direction === "vertical"
            ? `${crosswalkHeight}px`
            : `${crosswalkWidth}px`,
        top,
        left,

        backgroundImage: `repeating-linear-gradient(${
          direction === "vertical" ? "90deg" : "0"
        }, ${colorMappingBG[crosswalkStatus]}, ${
          colorMappingBG[crosswalkStatus]
        } 5px, transparent 5px, transparent 10px)`,

        zIndex: 50,
      }}
    />
  );
};

export default Crosswalk;
