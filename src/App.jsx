import React, { useState } from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { ToastContainer } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            <CurrentAlarms isSidebar={sidebarOpen} />
          </div>
        </div>
        {/* leaflet map */}
        <div className={` ${sidebarOpen ? "w-[70vw]" : "w-[100vw]"} `}>
          <MonitoringMapReact
            isSidebarOpen={sidebarOpen}
            handleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
