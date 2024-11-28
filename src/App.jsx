import "react-toastify/dist/ReactToastify.css";

import { useContext, useEffect, useState } from "react";

import MapComponent from "./Pages/map/index.jsx";
import { ThemeContext } from "./context/themeContext.jsx";
import WarningMessage from "./components/offlineWarning/index.jsx";
import dangerSound from "../src/assets/audio/danger.mp3";
import positiveSound from "../src/assets/audio/positive.mp3";
import { subscribeToCurrentAlarms } from "./api/api.handlers.js";
import { t } from "i18next";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  //
  const [changedMarker, setChangedMarker] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isSubscribed) {
      subscribeToCurrentAlarms(onWSDataReceived);
    }
  }, [isSubscribed]);

  const onWSDataReceived = (data) => {
    // Prevent duplicate processing of the same data
    if (changedMarker?.eventdate === data.data.eventdate) {
      return;
    }
    setIsSubscribed(true);
    setChangedMarker(data.data);
    const sound = new Audio();
    sound.volume = 0.2;
    if (data.data.statuserror === 1) {
      sound.src = dangerSound;
    } else if (data.data.statuserror === 0) {
      sound.src = positiveSound;
    } else if (data.data.statuserror === 2) {
      sound.src = dangerSound;
    }
    sound.play();
  };

  //
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
      {/* <button
        onClick={toggleSidebar}
        className="fixed z-[10000000000000] top-4 left-4 p-2 bg-blue-500 text-white rounded-md shadow-lg focus:outline-none"
      >
        {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button> */}

      {!isOnline && <WarningMessage />}

      <MapComponent changedMarker={changedMarker} t={t} />
    </div>
  );
};

export default App;
