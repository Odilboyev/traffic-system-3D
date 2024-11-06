import { CameraIcon } from "@heroicons/react/16/solid";
import { Card, CardHeader, Typography } from "@material-tailwind/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { LiaTrafficLightSolid } from "react-icons/lia";
import { MdOutlineSensorWindow } from "react-icons/md";
import NeonIcon from "../../../../components/neonIcon";
const TrafficLightsCard = ({ data = [], length }) => {
  const { t } = useTranslation();
  const total = data.count_all;
  const onlineCount = data.data.find((item) => item.status === 0)?.count || 0;
  const onlinePercentage = ((onlineCount / total) * 100).toFixed(1);

  return (
    <Card
      className={`w-1/${length} px-4 xl:px-3 backdrop-blur-md bg-gray-900/80 text-white shadow-lg hover:shadow-2xl hover:bg-gray-800/70 transition-all duration-300  `}
    >
      <CardHeader className=" bg-gray-800 text-white p-3 rounded-lg mb-4 border-b border-gray-700">
        <Typography
          variant="h6"
          className="text-center font-semibold tracking-wider"
        >
          {t(data.type_name)}
        </Typography>
      </CardHeader>
      <div className="flex flex-col justify-center items-center h-full py-4 w-full">
        <div className="w-full grid grid-cols-2 gap-4 px-2 mb-6">
          {data.data?.length > 0 &&
            data.data.map(
              (value, i) =>
                value.status !== 1 && (
                  <div
                    className="flex items-center gap-3 from-blue-gray-900/60 to-black/50 backdrop-blur-xl p-3 rounded-lg"
                    key={i}
                  >
                    <NeonIcon
                      isRounded
                      icon={iconSwitcher(data.type)}
                      status={value.status}
                    />
                    <div className="flex-col flex">
                      <Typography className="text-2xl font-bold">
                        {value.count}
                      </Typography>
                      <Typography className="text-gray-400 text-xs font-medium">
                        {value.status_name}
                      </Typography>
                    </div>
                  </div>
                )
            )}
        </div>
        <div className="w-full px-2">
          <div className="text-sm text-gray-400 mb-2 flex justify-between">
            <span>Online Status</span>
            <span className="text-light-green-500">{onlinePercentage}%</span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-gray-800/50">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-green-500/80 transition-all duration-300"
              style={{ width: `${onlinePercentage}%` }}
            />
          </div>
        </div>
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
        return CameraIcon; // Default icon
    }
  })();

  return (
    <div className="flex items-center justify-center">
      <IconComponent className=" sm:h-8 sm:w-8 md:h-3 md:w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
    </div>
  );
};
