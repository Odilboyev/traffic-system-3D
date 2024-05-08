import React from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";

const App = () => {
  return (
    <div>
      {/* <MonitoringMap /> */}
      <MonitoringMapReact />
    </div>
  );
};

export default App;
