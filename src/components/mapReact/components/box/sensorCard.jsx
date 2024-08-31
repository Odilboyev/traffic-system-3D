import { Card, CardBody, Chip, Typography } from "@material-tailwind/react";
import moment from "moment";

const SensorCard = ({
  sensor_name,
  sensor_value,
  statuserrorname,
  datetime,
  statuserror,
  isActive,
  sensor_id,
  handler,
}) => {
  const { background, boxShadow, textColor } = getRowColor(statuserror);

  return (
    <div
      onClick={() => handler(sensor_id)}
      className={`h-full my-4 text-left w-[15vw] relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-300 cursor-pointer ${
        isActive ? "border border-blue-400" : "border border-transparent"
      } ${textColor}`}
    >
      <div
        className="backdrop-blur-3xl min-h-full"
        style={{
          background: "rgba(255, 255, 255, 0.1)", // Semi-transparent background for glass effect
        }}
      >
        <div className="relative min-h-full z-10 p-6">
          <Typography variant="h3" className="font-bold">
            {sensor_name}
          </Typography>
          <Typography
            variant="h5"
            className="font-semibold text-black dark:text-white my-4"
          >
            {statuserrorname}
          </Typography>
          <Typography className="font-semibold text-2xl ">
            {[2, 3, 16].includes(sensor_id) &&
              `${sensor_value}${sensor_id === 2 ? "°C" : ""}`}
          </Typography>
        </div>
      </div>

      <div
        className="absolute top-1 right-1 h-[90%] w-[90%] rounded-full  -z-10"
        style={{
          background,
          boxShadow,
          opacity: "0.5",
          // filter: "blur(15px)",
        }}
      ></div>
      {/* <div
        className="absolute top-5 left-5 h-20 w-20 rounded-full -z-10"
        style={{
          background,
          boxShadow,
          opacity: "0.5",
          // filter: "blur(15px)",
        }}
      ></div> */}
    </div>
  );
};

export default SensorCard;

const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return {
        background: "rgba(0, 255, 0, 0.9)", // Light green background with transparency
        boxShadow: "0 0 15px 3px rgba(0, 255, 0, 0.5)", // Green neon glow
        textColor: "text-green-800 dark:text-green-300",
      };
    case 1:
      return {
        background: "rgba(255, 165, 0, 0.9)", // Light orange background with transparency
        boxShadow: "0 0 15px 3px rgba(255, 165, 0, 0.5)", // Orange neon glow
        textColor: "text-orange-800 dark:text-orange-300",
      };
    case 2:
      return {
        background: "rgba(255, 0, 0, 0.9)", // Light red background with transparency
        boxShadow: "0 0 15px 3px rgba(255, 0, 0, 0.5)", // Red neon glow
        textColor: "text-red-800 dark:text-red-300",
      };
    case 3:
      return {
        background: "rgba(105, 105, 105, 0.9)", // Light gray background with transparency
        boxShadow: "0 0 15px 3px rgba(105, 105, 105, 0.5)", // Gray neon glow
        textColor: "text-gray-900 dark:text-gray-300",
      };
    default:
      return {
        background: "rgba(255, 255, 255, 0.9)", // Default light background with transparency
        boxShadow: "0 0 15px 3px rgba(255, 255, 255, 0.5)", // White neon glow
        textColor: "text-gray-900 dark:text-white",
      };
  }
};
