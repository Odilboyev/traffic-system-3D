import React, { useEffect, useState, memo } from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import { GetCurrentAlarms, subscribeToCurrentAlarms } from "./apiHandlers";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setCurrentAlarms] = useState(null);
  const [changedMarker, setChangedMarker] = useState(null);
  console.log(changedMarker, "changed marker");
  useEffect(() => {
    getCurrentAlarmsData();
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);
  const onWSDataReceived = (data) => {
    // console.log(data, "ws data received");

    if (data["marker"] !== undefined || data["marker"] !== null) {
      setChangedMarker(data.marker);
    }
    if (data.status == "update") {
      toaster(data.data);
      getCurrentAlarmsData();
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

  return (
    <div>
      <div className=" flex ">
        {/* toaster */} <ToastContainer />
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
            changedMarker={changedMarker}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(App);
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
const toaster = (sensorData) => {
  console.log(sensorData, "toaster");
  switch (sensorData.statuserror) {
    case 0:
      toast.success(
        `Sensor ${sensorData.sensor_id} updated: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    case 1:
      toast.warn(
        `Sensor ${sensorData.sensor_id} updated with warning: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    case 2:
      toast.error(
        `Sensor ${sensorData.sensor_id} updated with error: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    default:
      toast.info(
        `Sensor ${sensorData.sensor_id} updated: ${sensorData.sensor_value}`,
        toastConfig
      );
  }
};
