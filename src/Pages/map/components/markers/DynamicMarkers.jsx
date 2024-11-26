import CustomMarker from "../customMarker";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PieChart } from "react-minimal-pie-chart";
import PropTypes from "prop-types";
import { getAllMarkers } from "../../../../api/api.handlers";
import { renderToString } from "react-dom/server";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import { useRef } from "react";
import { useSelector } from "react-redux";

const DynamicMarkers = ({
  useDynamicFetching,
  usePieChartForClusteredMarkers,
  isDraggable,
  filter,
  setMarkers,
  clearMarkers,
  updateMarkers,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
}) => {
  const clusterRef = useRef(null);
  const markers = useSelector((state) => state.map.markers); // Assuming markers are stored in state.map.markers
  const fetchMarkers = async (body) => {
    try {
      const response = await getAllMarkers(body);
      if (response.status === "error") {
        clearMarkers();
        return;
      }
      setMarkers(response.data);
    } catch (error) {
      console.error("Error fetching markers:", error);
      clearMarkers();
    }
  };
  useMapDataFetcher({
    fetchData: useDynamicFetching ? fetchMarkers : null, // Pass null if not using dynamic fetching
    onClearData: useDynamicFetching ? clearMarkers : null,
    onNewData: useDynamicFetching ? updateMarkers : null,
    minZoom: 5,
    fetchDistanceThreshold: 500,
    useDistanceThreshold: true,
  });

  // Render function for markers
  const renderMarkers = () =>
    markers.map((marker, i) => {
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
      );
    });

  // Render component
  return (
    <div>
      {useDynamicFetching ? (
        <MarkerClusterGroup
          ref={clusterRef}
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
          disableClusteringAtZoom={17}
          zoomToBoundsOnClick={true}
          animate={true}
          animateAddingMarkers={false}
          iconCreateFunction={
            usePieChartForClusteredMarkers ? (e) => ClusterIcon(e) : null
          }
        >
          <>{renderMarkers()}</>
        </MarkerClusterGroup>
      ) : (
        <MarkerClusterGroup
          ref={clusterRef}
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
          disableClusteringAtZoom={17}
          zoomToBoundsOnClick={true}
          animate={true}
          animateAddingMarkers={false}
          iconCreateFunction={
            usePieChartForClusteredMarkers ? (e) => ClusterIcon(e) : null
          }
        >
          {renderMarkers()}
        </MarkerClusterGroup>
      )}
    </div>
  );
};

DynamicMarkers.propTypes = {
  useDynamicFetching: PropTypes.bool.isRequired,
  usePieChartForClusteredMarkers: PropTypes.bool,
  isDraggable: PropTypes.bool.isRequired,
  filter: PropTypes.object.isRequired,
  setMarkers: PropTypes.func.isRequired,
  clearMarkers: PropTypes.func.isRequired,
  updateMarkers: PropTypes.func.isRequired,
  handleMonitorCrossroad: PropTypes.func.isRequired,
  handleBoxModalOpen: PropTypes.func.isRequired,
  handleLightsModalOpen: PropTypes.func.isRequired,
  handleMarkerDragEnd: PropTypes.func.isRequired,
};

export default DynamicMarkers;
// Cluster icon logic
const ClusterIcon = (cluster) => {
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  let isHighlighted = false;

  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));

  const pieChartIcon = L.divIcon({
    className: `cluster !bg-transparent`,
    iconSize: L.point(50, 50),
    html: renderToString(
      <div
        className={`w-20 h-20 !bg-transparent ${
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
          style={{ filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))` }}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          segmentsShift={1}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
          label={(props) => props.dataEntry.value}
        />
      </div>
    ),
  });

  return pieChartIcon;
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#FFD54F";
    case 2:
      return "#FF5252";
    case 3:
      return "#FF4081";
    case 0:
    default:
      return "#66BB6A";
  }
};
