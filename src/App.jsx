import { useContext, useEffect, useState } from "react";
import MonitoringMapReact from "./components/mapReact";
import { ToastContainer } from "react-toastify";
import { subscribeToCurrentAlarms } from "./api/apiHandlers.js";
import toaster from "./tools/toastconfig";
import dangerSound from "../src/assets/audio/danger.mp3";
import positiveSound from "../src/assets/audio/positive.wav";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/themeContext.jsx";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [changedMarker, setChangedMarker] = useState(null);

  useEffect(() => {
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);

  const onWSDataReceived = (data) => {
    if (data.marker !== undefined && data.marker !== null) {
      setChangedMarker(data.marker);
    }

    if (data.status === "update") {
      toaster(data.data, toastConfig);
      const sound = new Audio();
      if (data.data.statuserror === 1) {
        sound.src = dangerSound;
      } else if (data.data.statuserror === 2) {
        sound.src = dangerSound;
      } else if (data.data.statuserror === 0) {
        sound.src = positiveSound;
      }
      sound.play();
    }
  };

  return (
    <div
      className={`min-h-screen app-container ${
        theme === "dark" ? "bg-gray-900 text-white" : " text-black"
      }`}
    >
      <ToastContainer className="z-[99999]" />

      <MonitoringMapReact changedMarker={changedMarker} />
    </div>
  );
};

export default App;

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};
