import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Progress,
  CardHeader,
} from "@material-tailwind/react";
import NeonIcon from "../neonIcon";
import { LiaTrafficLightSolid } from "react-icons/lia";
import { CameraIcon } from "@heroicons/react/16/solid";
import { MdOutlineSensorWindow } from "react-icons/md";

const TrafficLightsCard = ({ data = [], length }) => {
  const total = data.count_all;
  const onlineCount = data.data.find((item) => item.status === 0)?.count || 0;
  const onlinePercentage = ((onlineCount / total) * 100).toFixed(1);

  return (
    <Card
      className={`w-1/${length} h-full px-10 bg-gray-900/90 backdrop-blur-md text-white`}
    >
      <CardHeader className="bg-blue-gray-900 text-white p-4">
        <Typography variant="h5" className="text-center">
          {data.type_name}
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col justify-center items-center h-full pb-10 pt-8">
        <div className="flex justify-evenly items-center mb-10 flex-wrap gap-10 ">
          {data.data?.length > 0 &&
            data.data.map((value, i) => (
              <div className="flex items-center gap-6" key={i}>
                <div className="w-8 h-8  rounded-full flex items-center justify-center ">
                  <NeonIcon
                    icon={iconSwitcher(data.type)}
                    status={value.status}
                  />
                </div>
                <div className="flex-col flex">
                  <Typography variant="h4">{value.count}</Typography>
                  <Typography className="text-blue-gray-300 ">
                    {value.status_name}
                  </Typography>
                </div>
              </div>
            ))}
        </div>
        <Progress
          // variant="gradient"
          value={onlinePercentage}
          color="light-green"
          className="bg-blue-gray-900 h-6 font-bold shadow-neon "
          // label={`${onlinePercentage}%`}
          label={true}
        />
      </CardBody>
    </Card>
  );
};

export default TrafficLightsCard;
const iconSwitcher = (type) => {
  if (typeof type === "number") {
    switch (type) {
      case 4:
        return LiaTrafficLightSolid;
      case 1:
        return CameraIcon;
      case 3:
        return MdOutlineSensorWindow;

      default:
        LiaTrafficLightSolid;
    }
  }
};
