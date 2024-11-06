import { Typography } from "@material-tailwind/react";
import L from "leaflet";
import PropTypes from "prop-types";
import { useRef } from "react";
import { renderToString } from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PieChart } from "react-minimal-pie-chart";
import CustomPopup from "../customPopup";

const ClusteredMarkers = ({
  usePieChartForClusteredMarkers,
  markers,
  filter,
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
  changedMarker,
}) => {
  const clusterRef = useRef(null);
  const markerUpdate = markers?.length || 0;
  console.log(usePieChartForClusteredMarkers, "mrkers");
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
          usePieChartForClusteredMarkers
            ? (e) => ClusterIcon(e, changedMarker)
            : null
        }
      >
        {markers?.map((marker, i) => {
          // Skip markers based on filter
          if (
            (marker.type === 1 && !filter.camera) ||
            (marker.type === 2 && !filter.crossroad) ||
            (marker.type === 3 && !filter.box) ||
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
            <Marker
              key={i}
              markerId={marker.cid}
              markerType={marker.type}
              position={[marker.lat, marker.lng]}
              draggable={isDraggable}
              rotationAngle={marker.rotated}
              eventHandlers={{
                click: () => {
                  if (marker.type === 2) handleMonitorCrossroad(marker);
                  else if (marker.type === 3) handleBoxModalOpen(marker);
                  else if (marker.type === 4) handleLightsModalOpen(marker);
                },
                dragend: (event) =>
                  handleMarkerDragEnd(marker.cid, marker.type, event),
              }}
              statuserror={marker.statuserror}
              icon={L.icon({
                iconUrl: `icons/${marker.icon}`,
                iconSize: [40, 40],
              })}
              rotatedAngle={marker.type === 3 ? marker.rotated : 0}
            >
              {(marker.type === 1 ||
                marker.type === 5 ||
                marker.type === 6) && <CustomPopup marker={marker} />}
              <Tooltip direction="top" className="rounded-md">
                {marker.type === 1 || marker.type === 5 || marker.type === 6 ? (
                  <div
                    style={{ width: "8vw", height: "6vw", overflow: "hidden" }}
                  >
                    <img
                      src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
                      className="w-full"
                      alt=""
                    />
                    <Typography className="my-0">{marker?.cname}</Typography>
                  </div>
                ) : (
                  <Typography className="my-0">{marker?.cname}</Typography>
                )}
              </Tooltip>
            </Marker>
          );
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
      return "#FFD700"; // orange
    case 2:
      return "#FF4500"; // red
    case 3:
      return "#FFC0CB"; // pink
    default:
      return "#4682B4"; // green
  }
};
