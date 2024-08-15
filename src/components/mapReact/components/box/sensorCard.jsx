import { Card, CardBody, Chip, Typography } from "@material-tailwind/react";
import moment from "moment";
import { useEffect, useState } from "react";

const SensorCard = ({
  sensor_name,
  sensor_value,
  datetime,
  statuserror,
  sensor_id,
  handler,
}) => {
  return (
    <Card
      onClick={() => handler(sensor_id)}
      className={`border-0 shadow-md hover:shadow-lg w-full ${
        statuserror === 0
          ? "bg-green-100"
          : statuserror === 1
          ? "bg-orange-200"
          : statuserror === 2
          ? "bg-red-200"
          : statuserror === 3
          ? "bg-gray-500"
          : ""
      }`}
    >
      <CardBody>
        <div className="flex items-center justify-between">
          <Chip size="lg" value={sensor_value} />
        </div>
        <div className="mt-4">
          <Typography color="blue-gray" variant="h6" className="font-bold">
            {sensor_name}
          </Typography>
        </div>
        <div className="mt-4">
          <Typography variant="h6" className="font-bold">
            {moment(datetime).format("HH:MM:SS")}
          </Typography>{" "}
          <Typography variant="paragraph">
            {" "}
            {moment(datetime).format("YYYY-MM-DD")}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default SensorCard;
