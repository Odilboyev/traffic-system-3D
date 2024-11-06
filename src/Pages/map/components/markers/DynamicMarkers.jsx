import { Typography } from "@material-tailwind/react";
import L from "leaflet";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { getAllMarkers } from "../../../../api/api.handlers"; // You'll need to create this
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import CustomPopup from "../customPopup";

// Rename from MarkerComponent to DynamicMarkerComponent
const DynamicMarkers = ({
  markers,
  filter,
  isDraggable,
  setMarkers,
  clearMarkers,
  updateMarkers,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
}) => {
  // Fetching function passed to custom hook
  const fetchMarkers = async (body) => {
    try {
      const response = await getAllMarkers(body);
      console.log(response, "response");
      if (response.status === "error") {
        console.error(response.message);
        clearMarkers();
        return;
      }

      setMarkers(response.data);
    } catch (error) {
      console.error("Error fetching markers:", error);
      clearMarkers();
    }
  };

  // Use the custom hook
  useMapDataFetcher({
    fetchData: fetchMarkers,
    onClearData: clearMarkers,
    onNewData: updateMarkers,
    minZoom: 5, // Adjust this value based on your needs
    fetchDistanceThreshold: 500, // Adjust this value based on your needs
    useDistanceThreshold: true,
  });

  return (
    <>
      {markers.map((marker) => {
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

        // Skip mapping the marker if lat or lng is undefined
        if (isNaN(Number(marker.lat)) || isNaN(Number(marker.lng))) {
          return null;
        }
        return (
          <Fragment key={`${marker.cid}-${marker.type}`}>
            <Marker
              markerId={marker.cid}
              markerType={marker.type}
              position={[marker.lat, marker.lng]}
              draggable={isDraggable}
              rotationAngle={marker.rotated}
              eventHandlers={{
                click:
                  marker.type == 2
                    ? () => handleMonitorCrossroad(marker)
                    : marker.type == 3
                    ? () => handleBoxModalOpen(marker)
                    : marker.type == 4
                    ? () => handleLightsModalOpen(marker)
                    : null,
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
              {marker.type === 1 || marker.type === 5 || marker.type === 6 ? (
                <CustomPopup marker={marker} />
              ) : null}
              <Tooltip direction="top" className="rounded-md">
                {marker.type == 1 || marker.type == 5 || marker.type == 6 ? (
                  <div
                    style={{
                      width: "8vw",
                      height: "6vw",
                      overflow: "hidden",
                    }}
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
          </Fragment>
        );
      })}
    </>
  );
};

DynamicMarkers.propTypes = {
  markers: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  isDraggable: PropTypes.bool.isRequired,
  setMarkers: PropTypes.func.isRequired,
  clearMarkers: PropTypes.func.isRequired,
  updateMarkers: PropTypes.func.isRequired,
  handleMonitorCrossroad: PropTypes.func.isRequired,
  handleBoxModalOpen: PropTypes.func.isRequired,
  handleLightsModalOpen: PropTypes.func.isRequired,
  handleMarkerDragEnd: PropTypes.func.isRequired,
};

export default DynamicMarkers;
