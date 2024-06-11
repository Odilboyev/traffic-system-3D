import React, { useEffect, useState, memo, useRef } from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import { GetCurrentAlarms, subscribeToCurrentAlarms } from "./apiHandlers";
import ResizePanel from "react-resize-panel";
import toaster from "./tools/toastconfig";
import dangerSound from "../src/assets/audio/danger.mp3";
import { Resizable } from "re-resizable";
// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [data, setCurrentAlarms] = useState(null);
  const [changedMarker, setChangedMarker] = useState(null);
  // console.log(changedMarker, "changed marker");
  useEffect(() => {
    getCurrentAlarmsData();
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);
  const onWSDataReceived = (data) => {
    if (data["marker"] !== undefined && data["marker"] !== null) {
      setChangedMarker(data.marker);
    }

    if (data.status === "update") {
      toaster(data.data, toastConfig);
      getCurrentAlarmsData();
      const sound = new Audio();
      // Play sound based on data.data.statuserror
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
  //styles

  const currentSidebarOpen = JSON.parse(localStorage.getItem("sidebarOpen"));
  const currentSidebarWidth = localStorage.getItem("sidebarWidth");
  const [sidebarOpen, setSidebarOpen] = useState(
    currentSidebarOpen ? currentSidebarOpen : false
  );
  const [sidebarWidth, setSidebarWidth] = useState(
    currentSidebarWidth ? currentSidebarWidth : 300
  );
  const mapComponentRef = useRef(null);

  useEffect(() => {
    if (mapComponentRef.current) {
      if (sidebarOpen)
        mapComponentRef.current.style.width =
          "calc(100%-" + sidebarWidth + "px)";
      else mapComponentRef.current.style.width = "100%";
    }
    console.log(mapComponentRef.current.style.width);
    return () => {};
  }, [sidebarOpen, sidebarWidth]);

  const handleSidebar = () => {
    localStorage.setItem("sidebarOpen", !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };
  const handleSidebarWidth = (e) => {
    localStorage.setItem("sidebarWidth", e.clientX);
    setSidebarWidth(e.clientX);
  };

  return (
    <div>
      <div className="flex">
        <ToastContainer />
        <Resizable
          onResize={(e) => handleSidebarWidth(e)}
          size={{
            width: sidebarOpen ? sidebarWidth : 0,
            height: "100%",
          }}
          className={` bg-gray-100 max-h-screen overflow-auto  relative `}
          // className={`bg-gray-100 max-h-screen overflow-auto  relative`}
        >
          <div className="w-full h-full">
            <CurrentAlarms isSidebar={sidebarOpen} data={data} />
          </div>
          {/* <div className="resize-handle absolute top-0 right-[-5px] z-50 h-full w-2 cursor-ew-resize bg-gray-300 hover:bg-gray-400" /> */}
        </Resizable>

        <div ref={mapComponentRef}>
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
