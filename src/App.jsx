import { useContext, useEffect, useRef, useState } from "react";
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
  const changedMarkerRef = useRef(null);

  useEffect(() => {
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);

  const onWSDataReceived = (data) => {
    if (data.status === "update") {
      if (data.marker !== undefined && data.marker !== null) {
        changedMarkerRef.current = data.marker;

        // setTimeout(() => {
        //   changedMarkerRef.current = null;
        //   // Force a re-render if needed
        // }, 3000); // Stop animation after 3 seconds
      }

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

      <MonitoringMapReact changedMarker={changedMarkerRef.current} />
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
