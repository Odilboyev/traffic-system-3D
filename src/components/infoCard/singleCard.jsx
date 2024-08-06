import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Progress,
  CardHeader,
} from "@material-tailwind/react";
import { IoIosWalk, IoMdMan, IoMdAlert } from "react-icons/io";
import NeonIcon from "../neonIcon";
import { LiaTrafficLightSolid } from "react-icons/lia";

const TrafficLightsCard = ({ data = [], length }) => {
  const total = data.count_all;
  const onlineCount = data.data.find((item) => item.status === 0)?.count || 0;
  const onlinePercentage = ((onlineCount / total) * 100).toFixed(1);

  return (
    <Card
      className={`w-1/${
        length + 4
      } h-full px-10 dark:bg-gray-900/90 backdrop-blur-md  bg-white dark:!text-white my-5`}
    >
      <CardHeader className="dark:bg-blue-gray-900 dark:text-white p-4">
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
                  <NeonIcon icon={LiaTrafficLightSolid} status={value.status} />
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
