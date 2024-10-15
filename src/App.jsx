import { useContext, useState, useEffect } from "react";
import MonitoringMapReact from "./components/mapReact";
import { ToastContainer } from "react-toastify";
import dangerSound from "../src/assets/audio/danger.mp3";
import positiveSound from "../src/assets/audio/positive.mp3";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/themeContext.jsx";
import { subscribeToCurrentAlarms } from "./api/api.handlers.js";
import WarningMessage from "./components/offlineWarning/index.jsx";

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
    setIsSubscribed(true);
    setChangedMarker(data.data);

    const sound = new Audio();
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

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
      <ToastContainer className="z-[9998]" />
      <MonitoringMapReact changedMarker={changedMarker} />
    </div>
  );
};

export default App;
