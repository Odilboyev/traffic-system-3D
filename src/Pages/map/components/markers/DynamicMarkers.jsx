import CustomMarker from "./customMarker";
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
    fetchData: useDynamicFetching ? fetchMarkers : () => {}, // Pass null if not using dynamic fetching
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
        (marker.type === 5 && !filter.cameraview) ||
        (marker.type === 6 && !filter.camerapdd)
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
        <>{renderMarkers()}</>
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
            usePieChartForClusteredMarkers
              ? (e) => ClusterIcon(e)
              : (e) => ClusterIcon(e, true)
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
  updateMarkers: PropTypes.func,
  handleMonitorCrossroad: PropTypes.func.isRequired,
  handleBoxModalOpen: PropTypes.func.isRequired,
  handleLightsModalOpen: PropTypes.func.isRequired,
  handleMarkerDragEnd: PropTypes.func.isRequired,
};

export default DynamicMarkers;
// Cluster icon logic
const ClusterIcon = (cluster, useCrossRoadCount) => {
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  const crossroadStatusCounts = {};
  let isHighlighted = false;

  let crossRoadCount = 0;

  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    if (marker.options.type === 2) {
      crossRoadCount++;
      crossroadStatusCounts[status] = (crossroadStatusCounts[status] || 0) + 1;
    }

    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));
  const crossroadPieChartData = Object.entries(crossroadStatusCounts).map(
    ([status, count]) => ({
      status: parseInt(status),
      count,
    })
  );

  const pieChartIcon = L.divIcon({
    className: `cluster !bg-transparent`,
    html: renderToString(
      // useCrossRoadCount ? (
      //   <div
      //     className=" rounded-full w-full cursor-pointer bg-green-600 min-w-12 min-h-12 max-h-12 flex items-center justify-center text-white font-bold text-lg"
      //     style={{ pointerEvents: "none" }}
      //   >
      //     {crossRoadCount}
      //   </div>
      // ) : (
      <div
        className={`relative w-16 h-16 !bg-transparent ${
          isHighlighted ? "animate-pulse" : ""
        }`}
        // style={{ background: getStatusColor(datam.status) }}
      >
        {/* Render the pie chart */}
        {/* Add crossRoadCount in the middle if useCrossRoadCount is true */}
        <PieChart
          data={(useCrossRoadCount ? crossroadPieChartData : pieChartData).map(
            (datam, key) => ({
              value: datam.count,
              title: datam.status,
              color: getStatusColor(datam.status),
              key,
            })
          )}
          style={{ filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))` }}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          segmentsShift={1}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "1.1rem",
            fontWeight: "bolder",
          }}
          label={
            !useCrossRoadCount ? (props) => props.dataEntry.value : undefined
          }
        />
        {useCrossRoadCount && crossroadPieChartData.length > 0 && (
          <div
            className="absolute top-1/2 left-1/2 transform bg-white w-10 h-10 text-blue-gray-900 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2  font-bold text-lg"
            style={{
              pointerEvents: "none",
            }}
          >
            {crossRoadCount}
          </div>
        )}
      </div>
      // )
    ),
  });
  //94/6

  return pieChartIcon;
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#FFD54F";
    case 2:
      return "#FF5252";
    case 0:
    default:
      return "#66BB6A";
  }
};
