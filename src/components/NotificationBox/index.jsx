import "./notificationBox.style.css";

import { BiBell, BiError } from "react-icons/bi";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TbDeviceComputerCamera } from "react-icons/tb";
import { ThemeContext } from "../../context/themeContext";
import dangerSound from "../../assets/audio/danger.mp3";
import positiveSound from "../../assets/audio/positive.mp3";
import { subscribeToCurrentAlarms } from "../../api/api.handlers.js";
import { t } from "i18next";
import { useMapMarkers } from "../../Pages/map/hooks/useMapMarkers";

const getStatusStyle = (statuserror, type_name, theme) => {
  const isLight = theme === "light";
  switch (statuserror) {
    case 0:
      return {
        border: isLight ? "border-l-green-500" : "border-l-green-500/50",
        bg: isLight ? "bg-green-50" : "bg-green-500/10",
        text: isLight ? "text-green-600" : "text-green-400",
        statusBg: isLight ? "bg-green-100" : "bg-green-500/20",
        icon: (
          <IoCheckmarkCircle
            className={isLight ? "text-green-600" : "text-green-400 text-lg"}
          />
        ),
        hoverBg: isLight ? "hover:bg-green-50" : "hover:bg-green-500/10",
        hoverBorder: "hover:border-l-green-500",
      };
    case 1:
    case 2:
      return {
        border: isLight ? "border-l-red-500" : "border-l-red-500/50",
        bg: isLight ? "bg-red-50" : "bg-red-500/10",
        text: isLight ? "text-red-600" : "text-red-400",
        statusBg: isLight ? "bg-red-100" : "bg-red-500/20",
        icon: (
          <BiError
            className={isLight ? "text-red-600" : "text-red-400 text-lg"}
          />
        ),
        hoverBg: isLight ? "hover:bg-red-50" : "hover:bg-red-500/10",
        hoverBorder: "hover:border-l-red-500",
      };

    default:
      return {
        border: isLight ? "border-l-sky-500" : "border-l-sky-500/50",
        bg: isLight ? "bg-sky-50" : "bg-sky-500/10",
        text: isLight ? "text-sky-600" : "text-sky-400",
        statusBg: isLight ? "bg-sky-100" : "bg-sky-500/20",
        icon: (
          <TbDeviceComputerCamera
            className={isLight ? "text-sky-600" : "text-sky-400 text-lg"}
          />
        ),
        hoverBg: isLight ? "hover:bg-sky-50" : "hover:bg-sky-500/10",
        hoverBorder: "hover:border-l-sky-500",
      };
  }
};

const NotificationBox = () => {
  const scrollRef = useRef(null);
  const { map } = useMapMarkers();
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const { theme } = useContext(ThemeContext);
  // const [notifications, setNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const notificationQueueRef = useRef([]);
  const processingRef = useRef(false);

  const processNotificationQueue = useCallback(() => {
    if (processingRef.current) return;

    processingRef.current = true;
    const queue = notificationQueueRef.current;
    notificationQueueRef.current = [];

    // Deduplicate notifications
    const uniqueNotifications = Array.from(
      new Map(
        queue.map((item) => [`${item.data.cid}-${item.data.type}`, item])
      ).values()
    );

    // Process notifications
    if (uniqueNotifications.length > 0) {
      const latestNotification =
        uniqueNotifications[uniqueNotifications.length - 1];

      // setChangedMarkers(
      //   uniqueNotifications.map((notification) => notification.data)
      // );

      // Add new notifications to the list
      setNotifications((prev) => [...prev, ...uniqueNotifications]);
      // Play sound based on the latest notification
      const sound = new Audio();
      sound.volume = 0.1;
      if (latestNotification.data.statuserror === 1) {
        sound.src = dangerSound;
      } else if (latestNotification.data.statuserror === 0) {
        sound.src = positiveSound;
      } else if (latestNotification.data.statuserror === 2) {
        sound.src = dangerSound;
      }
      sound.play();
    }

    processingRef.current = false;

    // Check if more notifications arrived during processing
    if (notificationQueueRef.current.length > 0) {
      processNotificationQueue();
    }
  }, []);

  useEffect(() => {
    const processQueueInterval = setInterval(() => {
      if (notificationQueueRef.current.length > 0) {
        processNotificationQueue();
      }
    }, 1000); // Process queue every 1000ms

    return () => clearInterval(processQueueInterval);
  }, [processNotificationQueue]);

  useEffect(() => {
    if (!isSubscribed) {
      subscribeToCurrentAlarms((data) => {
        // Prevent duplicate processing of the same data
        if (
          !notificationQueueRef.current.some(
            (item) => item.data.eventdate === data.data.eventdate
          )
        ) {
          notificationQueueRef.current.push(data);
          setIsSubscribed(true);
        }
      });
    }
  }, [isSubscribed]);
  useEffect(() => {
    // Add animation class to new notifications
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      const newItemKey = `${latestNotification.data.cid}-${latestNotification.data.type}-${notifications.length}`;
      setAnimatingItems(new Set([newItemKey])); // Reset and only animate the newest notification

      // Remove animation class after animation completes
      setTimeout(() => {
        setAnimatingItems(new Set());
      }, 2100); // 300ms slide + (600ms × 3) blink + 100ms buffer
    }
  }, [notifications]);

  return (
    // <Control position="bottomright">
    <div
      className={`w-96 fixed bottom-4 right-4 z-50 pointer-events-auto max-h-[300px] ${
        theme === "light" ? "bg-white/90" : "bg-gray-900/50"
      } backdrop-blur-lg rounded-lg overflow-hidden ${
        theme === "light" ? "border-gray-200/20" : "border-gray-700/20"
      } border shadow-lg`}
    >
      <div
        className={`px-4 py-3 ${
          theme === "light" ? "bg-gray-100/80" : "bg-gray-900/30"
        } backdrop-blur-xl ${
          theme === "light" ? "border-gray-200/20" : "border-gray-700/20"
        } border-b`}
      >
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
        className={`overflow-y-auto max-h-[250px] scrollbar-hide backdrop-blur-md ${
          theme === "light" ? "bg-white/50" : ""
        }`}
      >
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] text-sm font-mono text-sky-400/60">
            {t("no_active_notifications")}
          </div>
        ) : (
          [...notifications].reverse().map((notification, index) => {
            const status = getStatusStyle(
              notification.data.statuserror,
              notification.data.type_name,
              theme
            );
            const itemKey = `${notification.data.cid}-${
              notification.data.type
            }-${notifications.length - index}`;
            const isAnimating = animatingItems.has(itemKey);

            return (
              <div
                key={itemKey}
                className={`group px-4 py-2.5 ${
                  theme === "light"
                    ? "border-gray-200/10"
                    : "border-gray-700/10"
                } border-b transition-all duration-300 border-l-2 ${
                  status.border
                } ${status.hoverBg} ${status.hoverBorder} ${
                  isAnimating
                    ? `animate-slide-right ${
                        notification.data.statuserror === 1 ||
                        notification.data.statuserror === 2
                          ? "status-error"
                          : notification.data.statuserror === 0
                          ? "status-success"
                          : "status-default"
                      }`
                    : ""
                } cursor-pointer hover:scale-[1.02] active:scale-[0.98] transform`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="transform transition-transform duration-300 group-hover:scale-110">
                        {status.icon}
                      </span>
                      <p
                        className={`font-mono text-sm ${
                          theme === "light" ? "text-sky-600" : "text-sky-400"
                        } truncate flex-1`}
                      >
                        {notification.data.crossroad_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono font-medium ${status.text} ${status.statusBg} rounded transition-all duration-300 group-hover:scale-105`}
                      >
                        {notification.data.status_name}
                      </span>
                      <span
                        className={
                          theme === "light"
                            ? "text-sky-600/40"
                            : "text-sky-400/40"
                        }
                      >
                        |
                      </span>
                      <p
                        className={`font-mono text-xs ${
                          theme === "light"
                            ? "text-sky-600/70"
                            : "text-sky-400/60"
                        }`}
                      >
                        {notification.data.sensor_name}
                      </p>
                      {notification.data.lat && notification.data.lng && (
                        <>
                          <span
                            className={
                              theme === "light"
                                ? "text-sky-600/40"
                                : "text-sky-400/40"
                            }
                          >
                            |
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              map.flyTo(
                                [
                                  +notification.data.lat,
                                  +notification.data.lng,
                                ],
                                18
                              );
                            }}
                            className={`flex items-center gap-1 ${status.hoverBg} ${status.text} transition-transform duration-200 hover:scale-110 active:scale-90 transform`}
                          >
                            <HiOutlineLocationMarker className="text-base" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p
                        className={`font-mono text-xs ${
                          theme === "light"
                            ? "text-sky-600/70"
                            : "text-sky-400/60"
                        }`}
                      >
                        {notification.data.type_name} |{" "}
                        {notification.data.device_name}
                      </p>
                    </div>
                  </div>
                  <time
                    className={`font-mono text-xs ${
                      theme === "light" ? "text-sky-600/70" : "text-sky-400/60"
                    } whitespace-nowrap`}
                  >
                    {notification.data.eventdate.split(" ")[1]}
                  </time>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    // </Control>
  );
};

export default NotificationBox;
