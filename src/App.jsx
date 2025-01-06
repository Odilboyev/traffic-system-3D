import "react-toastify/dist/ReactToastify.css";

import { useCallback, useContext, useEffect, useRef, useState } from "react";

import MapComponent from "./Pages/map/index.jsx";
import NotificationBox from "./components/NotificationBox/index.jsx";
import { ThemeContext } from "./context/themeContext.jsx";
import WarningMessage from "./components/offlineWarning/index.jsx";
import dangerSound from "../src/assets/audio/danger.mp3";
import positiveSound from "../src/assets/audio/positive.mp3";
import { subscribeToCurrentAlarms } from "./api/api.handlers.js";
import { t } from "i18next";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [changedMarkers, setChangedMarkers] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifications, setNotifications] = useState([]);
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

      setChangedMarkers(
        uniqueNotifications.map((notification) => notification.data)
      );

      // Add new notifications to the list
      setNotifications((prev) => [...prev, ...uniqueNotifications]);

      // Play sound based on the latest notification
      const sound = new Audio();
      sound.volume = 0.2;
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
    const handleOnline = () => {
      setIsOnline(true);
      location.reload();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`min-h-screen app-container relative ${
        theme === "dark" ? "bg-gray-900 text-white" : "text-black"
      }`}
    >
      {!isOnline && <WarningMessage />}
      <MapComponent
        changedMarkers={changedMarkers}
        t={t}
        notifications={notifications}
      />
    </div>
  );
};

export default App;
