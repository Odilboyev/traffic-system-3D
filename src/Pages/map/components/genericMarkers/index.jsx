import { Typography } from "@material-tailwind/react";
import L from "leaflet";
import { Fragment } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { getAllMarkers } from "../../../../api/api.handlers"; // You'll need to create this
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import CustomPopup from "../customPopup";

const MarkerComponent = ({
  markers,
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
      {markers.map((marker, i) => (
        <Fragment key={`${marker.cid}-${marker.type}`}>
          <Marker
            markerId={marker.cid}
            markerType={marker.type}
            position={[marker.lat, marker.lng]}
            // draggable={isDraggable}
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
      ))}
    </>
  );
};

export default MarkerComponent;
