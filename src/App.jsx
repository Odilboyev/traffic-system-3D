import { useContext, useEffect, useState } from "react";
import MonitoringMapReact from "./components/mapReact";
import { ToastContainer } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import {
  GetCurrentAlarms,
  getInfoForCards,
  subscribeToCurrentAlarms,
} from "./api/apiHandlers.js";
import toaster from "./tools/toastconfig";
import dangerSound from "../src/assets/audio/danger.mp3";
import { Resizable } from "re-resizable";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/themeContext.jsx";
import BottomSection from "./components/infoCard/index.jsx";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setCurrentAlarms] = useState(null);
  const [bottomData, setBottomData] = useState(null);
  const [changedMarker, setChangedMarker] = useState(null);

  useEffect(() => {
    fetchData();
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);

  const onWSDataReceived = (data) => {
    if (data.marker !== undefined && data.marker !== null) {
      setChangedMarker(data.marker);
    }

    if (data.status === "update") {
      toaster(data.data, toastConfig);
      fetchData();
      const sound = new Audio();
      if (data.data.statuserror === 1) {
        sound.src = dangerSound;
      } else if (data.data.statuserror === 2) {
        sound.src = dangerSound;
      }
      sound.play();
    }
  };

  const fetchData = async () => {
    try {
      const [alarmsRes, infoRes] = await Promise.all([
        GetCurrentAlarms(),
        getInfoForCards(),
      ]);

      setCurrentAlarms(alarmsRes.data);
      setBottomData(infoRes);
      console.log(infoRes);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    <div
      className={`min-h-screen app-container ${
        theme === "dark" ? "bg-gray-900 text-white" : " text-black"
      }`}
    >
      <ToastContainer />
      <div className="flex">
        {/* <Resizable
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
        </Resizable> */}

        <div style={{ width: "100%" }} className="dark dark:text-white">
          <MonitoringMapReact
            isSidebarOpen={sidebarOpen}
            alarmCount={data?.length}
            handleSidebar={handleSidebar}
            changedMarker={changedMarker}
          />
          <BottomSection cardsInfoData={bottomData} />
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
