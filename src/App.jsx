import React, { useEffect, useState } from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { ToastContainer } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import { GetCurrentAlarms } from "./apiHandlers";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setCurrentAlarms] = useState(null);
  useEffect(() => {
    getCurrentAlarmsData();
  }, [sidebarOpen]);

  const getCurrentAlarmsData = async () => {
    try {
      const res = await GetCurrentAlarms();
      console.log(res);
      setCurrentAlarms(res.data);
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <div>
      <div className=" flex ">
        {/* toaster */}{" "}
        <ToastContainer
          limit={1}
          containerId="toaster-map"
          style={{ zIndex: 9999999 }}
        />
        {/* Sidebar */}
        <div
          className={` ${
            sidebarOpen ? "w-[30vw]  py-2 px-1" : " w-0"
          }  backdrop-blur-md  bg-gray-100/80 h-screen border border-blue-gray-100`}
        >
          <div className="w-full h-full relative">
            <CurrentAlarms isSidebar={sidebarOpen} data={data} />
          </div>
        </div>
        {/* leaflet map */}
        <div className={` ${sidebarOpen ? "w-[70vw]" : "w-[100vw]"} `}>
          <MonitoringMapReact
            isSidebarOpen={sidebarOpen}
            alarmCount={data?.length}
            handleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
