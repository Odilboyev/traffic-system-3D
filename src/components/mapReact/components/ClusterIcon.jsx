import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const ClusterIcon = ({ cluster }) => {
  console.log("cluster icon changed");
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));
  const totalMarkers = childMarkers.length;
  const pieChartIcon = L.divIcon({
    className: "cluster",
    iconSize: L.point(40, 40),
    html: renderToString(
      <div className="w-16 h-16">
        <PieChart
          data={pieChartData.map((datam) => ({
            value: datam.count,
            title: datam.status,
            color: getStatusColor(datam.status),
          }))}
          style={{ filter: `drop-shadow(0 0 0.75rem #0101018d)` }}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
          label={(props) => {
            return props.dataEntry.value;
          }}
        />
      </div>
    ),
  });
  return pieChartIcon;
};

export default ClusterIcon;

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#FFD700"; // Red
    case 2:
      return "#FF0000"; // Gold
    case 3:
      return "#FFC0CB"; // Teal
    default:
      return "#019191"; // Light Pink
  }
};
