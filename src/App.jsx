import React from "react";
import MonitoringMap from "./components/map";
import MonitoringMapReact from "./components/mapReact";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";

const App = () => {
  console.log(
    renderToString(
      <PieChart
        data={[
          {
            value: 1,
            title: "1",
            color: "green",
          },
          {
            value: 2,
            title: "2",
            color: "red",
          },
          {
            value: 1,
            title: "3",
            color: "orange",
          },
        ]}
        label={(props) => {
          return props.dataEntry.value;
        }}
      />
    )
  );
  return (
    <div>
      {/* <MonitoringMap /> */}
      <MonitoringMapReact />
    </div>
  );
};

export default App;
