import { BiBell, BiError } from "react-icons/bi";
import { IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

import Control from "../customControl";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { t } from "i18next";

const getStatusStyle = (statuserror, type_name) => {
  switch (statuserror) {
    case 1:
    case 2:
      return {
        border: "border-l-red-500/50",
        bg: "bg-red-500/10",
        text: "text-red-400",
        statusBg: "bg-red-500/20",
        icon: <BiError className="text-red-400 text-lg" />,
        hoverBg: "hover:bg-red-500/10",
        hoverBorder: "hover:border-l-red-500",
      };
    case 0:
      return {
        border: "border-l-teal-500/50",
        bg: "bg-teal-500/10",
        text: "text-teal-400",
        statusBg: "bg-teal-500/20",
        icon: <IoCheckmarkCircle className="text-teal-400 text-lg" />,
        hoverBg: "hover:bg-teal-500/10",
        hoverBorder: "hover:border-l-teal-500",
      };
    default:
      return {
        border: "border-l-sky-500/50",
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        statusBg: "bg-sky-500/20",
        icon: <TbDeviceComputerCamera className="text-sky-400 text-lg" />,
        hoverBg: "hover:bg-sky-500/10",
        hoverBorder: "hover:border-l-sky-500",
      };
  }
};

const NotificationBox = ({ notifications }) => {
  const scrollRef = useRef(null);
  const [animatingItems, setAnimatingItems] = useState(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Add animation class to new notifications
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      const newItemKey = `${latestNotification.data.cid}-${
        latestNotification.data.type
      }-${notifications.length - 1}`;
      setAnimatingItems((prev) => new Set([...prev, newItemKey]));

      // Remove animation class after animation completes
      setTimeout(() => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(newItemKey);
          return newSet;
        });
      }, 500);
    }
  }, [notifications]);

  return (
    <Control position="bottomright">
      <div className="w-96 max-h-[300px] bg-gray-900/50 backdrop-blur-lg rounded-lg overflow-hidden border border-gray-700/20 shadow-lg">
        <div className="px-4 py-3 bg-gray-900/30 backdrop-blur-xl border-b border-gray-700/20">
          <div className="flex items-center gap-2">
            <BiBell className="text-sky-400" />
            <h3 className="text-sm font-mono font-medium text-sky-400">
              {t("notifications")}
            </h3>
            {notifications.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-mono font-medium text-sky-400 bg-sky-500/10 rounded-full border border-gray-500/50 ml-auto">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
        <div
          ref={scrollRef}
          className="overflow-y-auto max-h-[250px] scrollbar-thin backdrop-blur-md"
        >
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-[100px] text-sm font-mono text-sky-400/60">
              {t("no_active_notifications")}
            </div>
          ) : (
            notifications.map((notification, index) => {
              const status = getStatusStyle(
                notification.data.statuserror,
                notification.data.type_name
              );
              const itemKey = `${notification.data.cid}-${notification.data.type}-${index}`;
              const isAnimating = animatingItems.has(itemKey);

              return (
                <div
                  key={itemKey}
                  className={`group px-4 py-2.5 border-b border-gray-700/10 transition-all duration-300 border-l-2 ${
                    status.border
                  } ${status.hoverBg} ${status.hoverBorder} ${
                    isAnimating ? "animate-slide-up" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="transform transition-transform duration-300 group-hover:scale-110">
                          {status.icon}
                        </span>
                        <p className="font-mono text-sm text-sky-400 truncate">
                          {notification.data.crossroad_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`px-2 py-0.5 text-xs font-mono font-medium ${status.text} ${status.statusBg} rounded transition-all duration-300 group-hover:scale-105`}
                        >
                          {notification.data.status_name}
                        </span>
                        <span className="text-sky-400/40">|</span>
                        <p className="font-mono text-xs text-sky-400/60">
                          {notification.data.sensor_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-xs text-sky-400/60">
                          {notification.data.type_name} |{" "}
                          {notification.data.device_name}
                        </p>
                      </div>
                    </div>
                    <time className="font-mono text-xs text-sky-400/60 whitespace-nowrap">
                      {notification.data.eventdate.split(" ")[1]}
                    </time>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Control>
  );
};

export default NotificationBox;
