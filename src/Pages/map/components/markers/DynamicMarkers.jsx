import { memo, useEffect, useRef, useState } from "react";

import CustomMarker from "./customMarker";
import { FaTrafficLight } from "react-icons/fa6";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PieChart } from "react-minimal-pie-chart";
import PropTypes from "prop-types";
import { getAllMarkers } from "../../../../api/api.handlers";
import { renderToString } from "react-dom/server";
// import { useMap } from "react-leaflet";
// import { useMapDataFetcher } from "../../../../customHooks/useMapDataFetcher";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useSelector } from "react-redux";
import { useTheme } from "../../../../customHooks/useTheme";

const DynamicMarkers = ({
  useDynamicFetching,
  usePieChartForClusteredMarkers,
  filter,
  setMarkers,
  clearMarkers,
  updateMarkers,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
  t,
}) => {
  // const map = useMap();
  const [zoom, setZoom] = useState(19);
  const clusterRef = useRef(null);
  const {
    markers,
    areMarkersLoading,
    errorMessage,
    getDataHandler,
    useClusteredMarkers,
    setUseClusteredMarkers,
  } = useMapMarkers();
  const lastFetchRef = useRef(Date.now());

  // Fetch markers data
  const fetchMarkers = async (bounds) => {
    if (Date.now() - lastFetchRef.current < 1000) {
      return; // Throttle requests to once per second
    }
    lastFetchRef.current = Date.now();

    try {
      const response = await getAllMarkers({
        ...filter,
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        },
      });

      if (response?.data) {
        const newMarkers = response.data.map((marker) => ({
          ...marker,
          lat: marker.lat || marker.latitude,
          lng: marker.lng || marker.longitude,
        }));

        if (updateMarkers) {
          updateMarkers(newMarkers);
        } else {
          setMarkers(newMarkers);
        }
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  // Use the map data fetcher hook for dynamic fetching
  // useMapDataFetcher({
  //   fetchData: fetchMarkers,
  //   onClearData: clearMarkers,
  //   onNewData: setMarkers,
  //   minZoom: 19,
  //   fetchDistanceThreshold: 100,
  //   useDistanceThreshold: useDynamicFetching,
  // });

  // Debug log for markers
  useEffect(() => {
    console.log("DynamicMarkers - Current markers:", markers);
  }, [markers]);

  // Add zoom and dragend event listeners
  // useEffect(() => {
  //   const handleZoomEnd = () => {
  //     setZoom(map.getZoom());
  //   };

  //   const handleDragEnd = () => {
  //     setZoom(map.getZoom());
  //   };

  //   map.on("zoomend", handleZoomEnd);
  //   map.on("dragend", handleDragEnd);

  //   // Cleanup event listeners
  //   return () => {
  //     map.off("zoomend", handleZoomEnd);
  //     map.off("dragend", handleDragEnd);
  //   };
  // }, [map]);

  // Render function for markers
  const renderMarkers = () =>
    markers.map((marker, i) => {
      // Check if marker should be filtered out based on zoom and type
      if (
        // Existing filter conditions
        (marker.type === 1 && !filter.cameratraffic) ||
        (marker.type === 2 && !filter.crossroad) ||
        (marker.type === 3 && !filter.boxcontroller) ||
        (marker.type === 4 && !filter.trafficlights) ||
        (marker.type === 5 && !filter.cameraview) ||
        (marker.type === 6 && !filter.camerapdd) ||
        // Zoom-based filtering logic
        (zoom <= 16 && marker.type !== 2) || // Only show crossroads at zoom 16 and below
        isNaN(Number(marker.lat)) ||
        isNaN(Number(marker.lng))
      ) {
        return null;
      }

      // Convert coordinates for 3D if needed

      // Custom crossroad icon for type 2 markers
      const createCrossroadIcon = (marker) => {
        const iconHtml = renderToString(
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-cyan-500/20 rounded-full backdrop-blur-md " />
            <div className="relative flex justify-center items-center w-6 h-6 bg-blue-600 rounded-full shadow-lg border border-white">
              <FaTrafficLight className="text-white w-3 h-3" />
            </div>
          </div>
        );

        return L.divIcon({
          className: "custom-crossroad-marker",
          html: iconHtml,
          iconAnchor: [8, 8],
        });
      };

      // Use custom icon for crossroads
      const customIcon = marker.type === 2 ? createCrossroadIcon(marker) : null;

      return (
        <CustomMarker
          t={t}
          zoom={zoom}
          key={i}
          marker={marker}
          L={L}
          handleMonitorCrossroad={handleMonitorCrossroad}
          handleBoxModalOpen={handleBoxModalOpen}
          handleLightsModalOpen={handleLightsModalOpen}
          handleMarkerDragEnd={handleMarkerDragEnd}
          customIcon={customIcon}
        />
      );
    });

  // Render component
  return (
    <div>
      {/* {useDynamicFetching ? (
        <>{renderMarkers()}</>
      ) : ( */}
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
      {/* )} */}
    </div>
  );
};

DynamicMarkers.propTypes = {
  useDynamicFetching: PropTypes.bool,
  usePieChartForClusteredMarkers: PropTypes.bool,
  filter: PropTypes.object,
  setMarkers: PropTypes.func,
  clearMarkers: PropTypes.func,
  updateMarkers: PropTypes.func,
  handleMonitorCrossroad: PropTypes.func,
  handleBoxModalOpen: PropTypes.func,
  handleLightsModalOpen: PropTypes.func,
  handleMarkerDragEnd: PropTypes.func,
  t: PropTypes.func,
};

export default memo(DynamicMarkers);

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
            fill: "#ffffff",
            fontSize: "1.1rem",
            fontWeight: "bolder",
          }}
          label={
            !useCrossRoadCount ? (props) => props.dataEntry.value : undefined
          }
        />
        {useCrossRoadCount && crossroadPieChartData.length > 0 && (
          <div
            className="absolute top-1/2 left-1/2 transform bg-blue-600 text-white w-10 h-10 rounded-full border flex items-center justify-center -translate-x-1/2 -translate-y-1/2  font-bold text-lg"
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
