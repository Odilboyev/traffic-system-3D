import { FaTrafficLight, FaVideo } from "react-icons/fa";

import { IoSpeedometer } from "react-icons/io5";
import { MdSensors } from "react-icons/md";
import React from "react";
import { useTranslation } from "react-i18next";

const DevicesStatusPanel = ({ cardsInfoData }) => {
  const { t } = useTranslation();

  const deviceTypes = [
    { key: "camera", icon: FaVideo },
    { key: "traffic_light", icon: FaTrafficLight },
    { key: "speed_radar", icon: IoSpeedometer },
    { key: "sensor", icon: MdSensors },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 " style={{ direction: "rtl" }}>
      <div className="contents w-full" style={{ direction: "ltr" }}>
        {cardsInfoData?.map((device, index) => {
          const total = device.count_all;
          const onlineCount =
            device.data.find((item) => item.status === 0)?.count || 0;
          const offlineCount = total - onlineCount;
          const Icon =
            deviceTypes.find((d) => d.key === device.type_name.toLowerCase())
              ?.icon || MdSensors;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-blue-gray-800/50 rounded-lg bg-blue-gray-900/60 backdrop-blur-sm hover:bg-blue-gray-900/70 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <Icon className="text-teal-300 text-2xl" />
                </div>
                <div className="text-sm text-white/90 ml-2">
                  <div className="font-medium">{total}</div>
                  <div className="text-teal-200/70">{t(device.type_name)}</div>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="h-full w-px bg-blue-gray-800/50"></div>
                <div className="text-center">
                  <div className="font-medium text-green-400">
                    {onlineCount}
                  </div>
                  <div className="text-green-400/70">{t("Online")}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-red-400">{offlineCount}</div>
                  <div className="text-red-400/70">{t("Offline")}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevicesStatusPanel;
