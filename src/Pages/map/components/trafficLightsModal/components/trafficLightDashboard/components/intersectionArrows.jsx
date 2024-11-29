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
    const baseStyle = "absolute text-5xl transition-transform duration-300";
    switch (direction) {
      case "north":
        return { className: `${baseStyle} top-4`, rotation: "rotate(0deg)" }; // Pointing up
      case "south":
        return {
          className: `${baseStyle} bottom-4`,
          rotation: "rotate(180deg)",
        }; // Pointing down
      case "east":
        return { className: `${baseStyle} right-4`, rotation: "rotate(90deg)" }; // Pointing right
      case "west":
        return { className: `${baseStyle} left-4`, rotation: "rotate(270deg)" }; // Pointing left
      default:
        return { className: baseStyle, rotation: "" };
    }
  };

  const getArrowColor = (direction) => {
    return trafficLights[direction] === "green"
      ? "text-green-500"
      : "text-red-500";
  };

  const renderArrow = (direction) => {
    if (!direction) return null;

    const { className, rotation } = getArrowStyle(direction);
    const colorClass = getArrowColor(direction);

    return (
      <div
        className={`${className} ${colorClass}`}
        style={{ transform: rotation }}
      >
        <HiArrowDown />
      </div>
    );
  };

  return (
    <div className="relative z-50 flex justify-center items-center h-64 w-64 bg-gray-800 rounded-md">
      {renderArrow(primary)}
      {renderArrow(secondary)}
    </div>
  );
};

export default IntersectionArrows;
