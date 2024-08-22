import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { memo } from "react";

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#FFD700"; // gold
    case 2:
      return "#FF4500"; // red
    case 3:
      return "#FFC0CB"; // pink
    default:
      return "#4682B4"; // steel blue
  }
};

// eslint-disable-next-line react/display-name
const ClusterIcon = (pieChartData) => {
  return L.divIcon({
    className: "cluster !bg-transparent",
    iconSize: L.point(50, 50),
    html: renderToString(
      <div className="w-20 h-20 !bg-transparent group-has-[div]:!bg-transparent">
        <PieChart
          data={pieChartData.map((data) => ({
            value: data.count,
            title: data.status,
            color: getStatusColor(data.status),
          }))}
          style={{
            filter: `drop-shadow(0 0 0.75rem #0101018d)`,
            background: "transparent !important",
          }}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          segmentsShift={1}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "0.9rem",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
          tooltip={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
          label={({ dataEntry }) => dataEntry.value}
        />
      </div>
    ),
  });
};

export default ClusterIcon;
