import React, { useEffect, useState, memo, useRef } from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { ToastContainer, toast } from "react-toastify";
import CurrentAlarms from "./components/mapReact/components/alarm";
import { GetCurrentAlarms, subscribeToCurrentAlarms } from "./apiHandlers";
import ResizePanel from "react-resize-panel";
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
  // const [width, setWidth] = useState(450);
  // const isResized = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const dx = e.clientX - initialX;
      const newWidth = initialWidth + dx;
      sidebarRef.current.style.width = `${newWidth}px`;
      setSidebarOpen(newWidth > 0);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, initialX, initialWidth]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      setIsResizing(true);
      setInitialX(e.clientX);
      setInitialWidth(sidebarRef.current.offsetWidth);
    }
  };
  return (
    <div>
      <div className="flex">
        <ToastContainer />
        <div
          ref={sidebarRef}
          onMouseDown={handleMouseDown}
          className={`${
            sidebarOpen ? "w-[30vw] py-2 px-1 pr-2" : "w-0"
          } bg-gray-100 max-h-screen overflow-auto  relative`}
        >
          <div className="w-full h-full">
            <CurrentAlarms isSidebar={sidebarOpen} data={data} />
          </div>
          <div className="resize-handle absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400" />
        </div>
        <div className={`${sidebarOpen ? "w-[70vw]" : "w-[100vw]"}`}>
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
