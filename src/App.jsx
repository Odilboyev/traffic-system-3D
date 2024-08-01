import { useEffect, useState } from "react";
import MonitoringMapReact from "./components/mapReact";
import { ToastContainer } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import { GetCurrentAlarms, subscribeToCurrentAlarms } from "./apiHandlers";
import toaster from "./tools/toastconfig";
import dangerSound from "../src/assets/audio/danger.mp3";
import { Resizable } from "re-resizable";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Assuming you have some global styles

const App = () => {
  const [data, setCurrentAlarms] = useState(null);
  const [changedMarker, setChangedMarker] = useState(null);

  useEffect(() => {
    getCurrentAlarmsData();
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);

  const onWSDataReceived = (data) => {
    if (data.marker !== undefined && data.marker !== null) {
      setChangedMarker(data.marker);
    }

    if (data.status === "update") {
      toaster(data.data, toastConfig);
      getCurrentAlarmsData();
      const sound = new Audio();
      if (data.data.statuserror === 1) {
        sound.src = dangerSound;
      } else if (data.data.statuserror === 2) {
        sound.src = dangerSound;
      }
      sound.play();
    }
  };

  const getCurrentAlarmsData = async () => {
    try {
      const res = await GetCurrentAlarms();
      setCurrentAlarms(res.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  // Retrieve sidebar state from local storage
  const currentSidebarOpen = JSON.parse(localStorage.getItem("sidebarOpen"));
  const currentSidebarWidth = localStorage.getItem("sidebarWidth");
  const [sidebarOpen, setSidebarOpen] = useState(currentSidebarOpen || false);
  const [sidebarWidth, setSidebarWidth] = useState(currentSidebarWidth || 300);

  const handleSidebar = () => {
    localStorage.setItem("sidebarOpen", !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarWidth = (e) => {
    localStorage.setItem("sidebarWidth", e.clientX);
    setSidebarWidth(e.clientX);
  };

  return (
    <div className="app-container">
      <ToastContainer />
      <div className="flex">
        <Resizable
          onResize={(e) => handleSidebarWidth(e)}
          size={{
            width: sidebarOpen ? sidebarWidth : 0,
            height: "100%",
          }}
          className="sidebar bg-gray-100 max-h-screen overflow-auto"
        >
          <div className="w-full h-full">
            <CurrentAlarms isSidebar={sidebarOpen} data={data} />
          </div>
        </Resizable>

        <div style={{ width: "100%" }}>
          <MonitoringMapReact
            isSidebarOpen={sidebarOpen}
            alarmCount={data?.length}
            handleSidebar={handleSidebar}
            changedMarker={changedMarker}
          />
        </div>
      </div>
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
