import { Card, CardBody, Chip, Typography } from "@material-tailwind/react";
import moment from "moment";
import { useEffect, useState } from "react";
import getRowColor from "../../../../configurations/getRowColor";

const SensorCard = ({
  sensor_name,
  sensor_value,
  statuserrorname,
  datetime,
  statuserror,
  active,
  sensor_id,
  handler,
}) => {
  return (
    <div
      onClick={() => handler(sensor_id)}
      className={`border dark:bg-blue-gray-800 dark:hover:bg-gray-800 ${
        active && "dark:bg-gray-800"
      } dark:text-white `}
    >
      {" "}
      <div className="p-5">
        <Typography variant="h6" className="font-bold">
          {sensor_name}
        </Typography>
      </div>
      <div className={`p-5 ${getRowColor(statuserror)}`}>{statuserrorname}</div>
      <div className="p-5">
        {sensor_value}
        {/* <Typography variant="h6" className="font-bold">
          {moment(datetime).format("HH:MM:SS")}
        </Typography>{" "}
        <Typography variant="paragraph">
          {" "}
          {moment(datetime).format("YYYY-MM-DD")}
        </Typography> */}
      </div>
    </div>
  );
};

export default SensorCard;
