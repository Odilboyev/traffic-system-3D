import { HiArrowDown } from "react-icons/hi2";

const IntersectionArrows = ({ trafficState }) => {
  const defaultTrafficLights = {
    east: "red",
    west: "red",
    north: "red",
    south: "green",
  };
  const trafficLights = trafficState || defaultTrafficLights;

  const getArrowDetails = () => {
    if (trafficLights.east === "green") {
      return {
        primary: "east",
        secondary: trafficLights.west === "green" ? "west" : null,
      };
    }
    if (trafficLights.west === "green") {
      return {
        primary: "west",
        secondary: trafficLights.east === "green" ? "east" : null,
      };
    }
    if (trafficLights.north === "green") {
      return {
        primary: "north",
        secondary: trafficLights.south === "green" ? "south" : null,
      };
    }
    if (trafficLights.south === "green") {
      return {
        primary: "south",
        secondary: trafficLights.north === "green" ? "north" : null,
      };
    }
    return { primary: null, secondary: null };
  };

  const { primary, secondary } = getArrowDetails();

  const getArrowStyle = (direction) => {
    switch (direction) {
      case "north":
        return { transform: "rotate(0deg)" };
      case "south":
        return { transform: "rotate(180deg)" };
      case "east":
        return { transform: "rotate(90deg)" };
      case "west":
        return { transform: "rotate(270deg)" };
      default:
        return {};
    }
  };

  return (
    <div className="relative flex flex-col items-center z-50">
      {primary && (
        <div className="absolute " style={{ ...getArrowStyle(primary) }}>
          <HiArrowDown />
        </div>
      )}
      {secondary && (
        <div className="absolute mt-14" style={{ ...getArrowStyle(secondary) }}>
          <HiArrowDown />
        </div>
      )}
    </div>
  );
};

export default IntersectionArrows;
