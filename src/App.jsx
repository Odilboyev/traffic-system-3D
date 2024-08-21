import { useContext, useState, useEffect } from "react";
import MonitoringMapReact from "./components/mapReact";
import { ToastContainer } from "react-toastify";
import dangerSound from "../src/assets/audio/danger.mp3";
import positiveSound from "../src/assets/audio/positive.wav";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/themeContext.jsx";
import { subscribeToCurrentAlarms } from "./api/api.handlers.js";

const App = () => {
  const { theme } = useContext(ThemeContext);
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

  return (
    <div
      className={`min-h-screen app-container ${
        theme === "dark" ? "bg-gray-900 text-white" : "text-black"
      }`}
    >
      <ToastContainer className="z-[99999]" />
      <MonitoringMapReact changedMarker={changedMarker} />
    </div>
  );
};

export default App;
