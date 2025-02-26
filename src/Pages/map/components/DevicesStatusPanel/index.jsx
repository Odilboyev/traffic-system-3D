import { FaTrafficLight, FaVideo } from "react-icons/fa";

import { BiSolidCctv } from "react-icons/bi";
import { IoSpeedometer } from "react-icons/io5";
import { MdSensors } from "react-icons/md";
import React from "react";
import { TbDeviceCctvFilled } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const DevicesStatusPanel = ({ cardsInfoData }) => {
  const { t } = useTranslation();

  const deviceTypes = [
    { key: 1, icon: FaVideo, name: "cameras_traffic" },
    { key: 5, icon: TbDeviceCctvFilled, name: "cameras_view" },
    { key: 6, icon: BiSolidCctv, name: "cameras_pdd" },
    { key: 4, icon: FaTrafficLight, name: "svetofors" },
  ];

  return (
    <div className="flex rounded-lg">
      {cardsInfoData
        ?.filter((d) => d.type !== 3)
        .map((device, index) => {
          const total = device.count_all;
          const onlineCount =
            device.data.find((item) => item.status === 0)?.count || 0;
          const offlineCount = total - onlineCount;
          const Icon =
            deviceTypes.find((d) => d.key === device.type)?.icon || MdSensors;

          return (
            <div
              key={index}
              className="border border-blue-gray-800/50 pb-12 relative backdrop-blur-sm bg-black/40"
            >
              <div className="flex p-4  items-center">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <Icon className="text-teal-300 text-2xl" />
                </div>
                <div className="ml-3">
                  <div className="text-lg font-bold text-white/90">{total}</div>
                  <div className="text-sm text-teal-200/70">
                    {t(device.type_name)}
                  </div>
                </div>
              </div>

              <div className="flex justify-around absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-green-500/20 to-red-500/20">
                <div>
                  <div className="text-base font-bold text-green-400">
                    {onlineCount}
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold text-red-400">
                    {offlineCount}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DevicesStatusPanel;
