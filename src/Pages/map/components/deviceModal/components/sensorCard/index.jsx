import { Card, CardBody, Chip, Typography } from "@material-tailwind/react";
import moment from "moment";

const SensorCard = ({
  sensor_name,
  sensor_value,
  statuserrorname,
  sensor_icon,
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
      className={`h-full my-4 text-left  border-2 relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-300 cursor-pointer ${
        isActive ? " border-blue-400" : "border border-transparent"
      } `}
    >
      <div
        className="relative min-h-full z-10 p-4 text-white "
        style={{
          background,
        }}
      >
        <Typography variant="h5" className={`${textColor} font-thin`}>
          {sensor_name}
        </Typography>{" "}
        <div className="">
          <div className="flex-col">
            <Typography variant="h3" className="font-semibold my-4">
              {statuserrorname}
            </Typography>
            <Typography className="font-semibold text-3xl absolute bottom-5 left-5">
              {[2, 3, 16].includes(sensor_id) &&
                `${sensor_value ?? 0}${sensor_id === 2 ? "°C" : ""}`}
            </Typography>
          </div>
          <div className="w-1/4">
            <img
              src={`sensor_icons/${sensor_icon}`}
              alt=""
              className="w-1/4 absolute bottom-5 right-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;

const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return {
        background: "#8AC53E", // Light green background with transparency
        boxShadow: "0 0 15px 3px #8AC53E)", // Green neon glow
        textColor: "text-green-900 d",
      };
    case 1:
      return {
        background: "#FF8E26", // Light orange background with transparency
        boxShadow: "0 0 15px 3px #FF8E26", // Orange neon glow
        textColor: "text-orange-900 da",
      };
    case 2:
      return {
        background: "#EB5757", // Light red background with transparency
        boxShadow: "0 0 15px 3px #EB5757", // Red neon glow
        textColor: "text-red-900",
      };
    case 3:
      return {
        background: "rgba(105, 105, 105, 0.9)", // Light gray background with transparency
        boxShadow: "0 0 15px 3px rgba(105, 105, 105, 0.5)", // Gray neon glow
        textColor: "text-gray-900 ",
      };
    default:
      return {
        background: "rgba(255, 255, 255, 0.9)", // Default light background with transparency
        boxShadow: "0 0 15px 3px rgba(255, 255, 255, 0.5)", // White neon glow
        textColor: "text-gray-900",
      };
  }
};
