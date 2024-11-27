import { Card, CardHeader, Typography } from "@material-tailwind/react";

import { LiaTrafficLightSolid } from "react-icons/lia";
import { MdOutlineSensorWindow } from "react-icons/md";
import NeonIcon from "../../../../components/neonIcon";
import { PiSecurityCameraDuotone } from "react-icons/pi";
import { TbDeviceCctv } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const InfoWidgetCard = ({ data = [], length = 0 }) => {
  const { t } = useTranslation();
  const total = data.count_all;
  const onlineCount = data.data.find((item) => item.status === 0)?.count || 0;
  const onlinePercentage = ((onlineCount / total) * 100).toFixed(1);
  const offlinePercentage = (100 - onlinePercentage).toFixed(1);

  return (
    <Card
      className={`min-w-1/${length}  px-1 xl:px-1 backdrop-blur-md bg-gray-900/80 text-white shadow-lg hover:shadow-xl hover:bg-gray-900/60 transition-all duration-300  `}
    >
      <CardHeader className=" bg-gray-800 text-white p-3 rounded-lg border-b border-gray-700">
        <p className="text-center text-xs font-semibold tracking-wider">
          {t(data.type_name)}
        </p>
      </CardHeader>
      <div className="flex flex-col justify-center items-center h-full pb-3 pt-9 w-full">
        {/* <div className="w-full px-2 absolute h-6 left-0 top-0 rounded-t-full text-sm text-gray-400 mb-2 flex justify-between bg-blue-gray-900/60 items-center">
         
        </div> */}
        <div className="w-full  px-2 relative">
          <div className="flex justify-center items-start pt-1 px-2 absolute -top-1/4 left-1/2 transform -translate-x-1/2 w-16 h-11  backdrop-blur-md bg-blue-gray-900 font-bold bg-green-600 drop-shadow-neon  rounded-full">
            {total}
          </div>
          <div className="bg-gray-900/60 backdrop-blur-2xl  shadow-lg rounded-lg">
            {" "}
            <div className="flex items-center w-full backdrop-blur-2xl gap-3 p-3 rounded-lg">
              {data.data?.length > 0 &&
                data.data.map(
                  (value, i) =>
                    value.status !== 1 && (
                      <div
                        className="flex flex-col items-center gap-3 w-full justify-between"
                        key={i}
                      >
                        <div>
                          <NeonIcon
                            text={
                              value.status_name == "online"
                                ? onlinePercentage + "%"
                                : offlinePercentage + "%"
                            }
                            isRounded
                            icon={iconSwitcher(data.type)}
                            status={value.status}
                            className=" !shadow-none !drop-shadow-none"
                          />
                        </div>

                        <div className="gap-2 items-center mb-1 flex">
                          <Typography className="text-base font-bold">
                            {value.count}
                          </Typography>

                          <Typography className="text-gray-400 text-xs font-medium">
                            {t(value.status_name)}
                          </Typography>
                        </div>
                      </div>
                    )
                )}{" "}
            </div>
          </div>

          <div className="w-full px-2 absolute bottom-0 left-0">
            <div className="text-sm text-gray-400 mb-2 flex justify-between"></div>
            <div className="w-full h-2 rounded-b-full bg-red-800/70">
              <div
                className="rounded-b-full h-full text-center bg-green-600 transition-all duration-1000"
                style={{ width: `${onlinePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfoWidgetCard;
const iconSwitcher = (type) => {
  const IconComponent = (() => {
    switch (type) {
      case 4:
        return LiaTrafficLightSolid;
      case 1:
        return PiSecurityCameraDuotone;
      case 3:
        return MdOutlineSensorWindow;
      default:
        return TbDeviceCctv; // Default icon
    }
  })();

  return (
    <div className="flex items-center justify-center ">
      <IconComponent className="text-lg" />
    </div>
  );
};
