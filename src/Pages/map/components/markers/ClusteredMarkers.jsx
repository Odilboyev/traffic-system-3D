import CustomMarker from "../customMarker";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PieChart } from "react-minimal-pie-chart";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";
import { useRef } from "react";
import { useSelector } from "react-redux";

const ClusteredMarkers = ({
  usePieChartForClusteredMarkers,
  // markers,
  filter,
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
  // changedMarker,
  L,
}) => {
  const clusterRef = useRef(null);
  // Access markers and changedMarker from Redux store
  const markers = useSelector((state) => state.map.markers); // Assuming markers are stored in state.map.markers
  const changedMarker = useSelector((state) => state.map.changedMarker); // Assuming changedMarker is stored in state.map.changedMarker

  const markerUpdate = markers?.length || 0;
  return (
    <div>
      <MarkerClusterGroup
        key={markerUpdate}
        ref={clusterRef}
        spiderfyOnMaxZoom={false}
        showCoverageOnHover={false}
        disableClusteringAtZoom={15}
        zoomToBoundsOnClick={true}
        animate={true}
        animateAddingMarkers={false}
        iconCreateFunction={
          usePieChartForClusteredMarkers ? (e) => ClusterIcon(e) : null
        }
      >
        {markers?.map((marker, i) => {
          // Skip markers based on filter
          if (
            (marker.type === 1 && !filter.cameratraffic) ||
            (marker.type === 2 && !filter.crossroad) ||
            (marker.type === 3 && !filter.boxcontroller) ||
            (marker.type === 4 && !filter.trafficlights) ||
            (marker.type === 6 && !filter.camerapdd) ||
            (marker.type === 5 && !filter.cameraview)
          ) {
            return null;
          }

          // Skip invalid coordinates
          if (isNaN(Number(marker.lat)) || isNaN(Number(marker.lng))) {
            return null;
          }

          return (
            <CustomMarker
              key={i}
              marker={marker}
              L={L}
              isDraggable={isDraggable}
              handleMonitorCrossroad={handleMonitorCrossroad}
              handleBoxModalOpen={handleBoxModalOpen}
              handleLightsModalOpen={handleLightsModalOpen}
              handleMarkerDragEnd={handleMarkerDragEnd}
            />
          ); // CustomMarker;
        })}
      </MarkerClusterGroup>
    </div>
  );
};

ClusteredMarkers.propTypes = {
  markers: PropTypes.array,
  filter: PropTypes.object,
  isDraggable: PropTypes.bool,
  usePieChartForClusteredMarkers: PropTypes.bool,
  handleMonitorCrossroad: PropTypes.func,
  handleBoxModalOpen: PropTypes.func,
  handleLightsModalOpen: PropTypes.func,
  handleMarkerDragEnd: PropTypes.func,
  changedMarker: PropTypes.object,
};

export default ClusteredMarkers;

const ClusterIcon = (cluster) => {
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  let isHighlighted = false;

  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    // if (
    //   marker.options.cid === changedMarker?.cid &&
    //   marker.options.type === changedMarker?.type
    // ) {
    //   isHighlighted = true;
    // }
  });

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));

  const pieChartIcon = L.divIcon({
    className: `cluster !bg-transparent `,
    iconSize: L.point(50, 50),
    html: renderToString(
      <div
        className={`w-20 h-20 !bg-transparent  group-has-[div]:!bg-transparent  ${
          isHighlighted ? "animate-pulse" : ""
        }`}
      >
        <PieChart
          data={pieChartData.map((datam, key) => ({
            value: datam.count,
            title: datam.status,
            color: getStatusColor(datam.status),
            key,
          }))}
          style={{
            filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))`,
            background: "transparent !important",
          }}
          segmentsStyle={{
            transition: "stroke .3s",
            cursor: "pointer",
            // filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          }}
          segmentsShift={1}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "0.9rem",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
          tooltip={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
          label={(props) => {
            return props.dataEntry.value;
          }}
        />
      </div>
    ),
  });

  return pieChartIcon;
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#FFD54F"; // Warm amber/gold
    case 2:
      return "#FF5252"; // Vibrant coral red
    case 3:
      return "#FF4081"; // Bright pink/magenta
    case 0:
    default:
      return "#66BB6A"; // Fresh green
  }
};
