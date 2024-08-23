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
      className={`w-1/${length} px-10 xl:px-5 bg-gray-900/90 backdrop-blur-md text-white`}
    >
      <CardHeader className="bg-blue-gray-900 text-white p-4">
        <Typography variant="h5" className="text-center">
          {data.type_name}
        </Typography>
      </CardHeader>
      <div className="flex flex-col justify-center items-center h-full pb-10 pt-8 w-full">
        <div className="w-full flex justify-start xl:justify-evenly  items-center mb-10 flex-wrap gap-5 ">
          {data.data?.length > 0 &&
            data.data.map(
              (value, i) =>
                value.status !== 1 && (
                  <div className="flex items-center gap-6" key={i}>
                    <div className=" rounded-full flex items-center justify-center ">
                      <NeonIcon
                        isRounded
                        icon={iconSwitcher(data.type)}
                        status={value.status}
                      />
                    </div>
                    <div className="flex-col flex">
                      <Typography className="text-xl font-bold">
                        {value.count}
                      </Typography>
                      <Typography className="text-blue-gray-300 ">
                        {value.status_name}
                      </Typography>
                    </div>
                  </div>
                )
            )}
        </div>
        <Progress
          // variant="gradient"
          value={+onlinePercentage}
          color="light-green"
          className="bg-blue-gray-900 h-6 font-bold shadow-neon xl:max-w-[80%]"
          // label={`${onlinePercentage}%`}
          label={true}
        />
      </div>
    </Card>
  );
};

export default TrafficLightsCard;
const iconSwitcher = (type) => {
  const IconComponent = (() => {
    switch (type) {
      case 4:
        return LiaTrafficLightSolid;
      case 1:
        return CameraIcon;
      case 3:
        return MdOutlineSensorWindow;
      default:
        return LiaTrafficLightSolid; // Default icon
    }
  })();

  return (
    <div className="flex items-center justify-center">
      <IconComponent className=" sm:h-8 sm:w-8 md:h-3 md:w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
    </div>
  );
};
