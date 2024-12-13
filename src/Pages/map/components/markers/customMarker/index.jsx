// MarkerComponent.jsx
import { Marker, Tooltip } from "react-leaflet";
import { memo, useRef, useState } from "react";

import CameraDetails from "../../customPopup";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { debounce } from "lodash";
import { getCameraDetails } from "../../../../../api/api.handlers";

const CustomMarker = memo(function CustomMarker({
  t,
  marker,
  L,
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
}) {
  const isCamera = (type) => type == 1 || type == 5 || type == 6;

  const cameraType = (type) => {
    switch (type) {
      case 1:
        return "cameratraffic";
      case 5:
        return "cameraview";
      case 6:
        return "camerapdd";
      default:
        return "";
    }
  };
  const [cameraData, setCameraData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fetchedDataMap = useRef(new Map()); // Store fetched data

  const fetchCameraDetails = async (type, id) => {
    const markerKey = `${type}-${id}`;
    if (fetchedDataMap.current.has(markerKey)) {
      setCameraData(fetchedDataMap.current.get(markerKey));
      return;
    }
    if (isCamera(type)) {
      setIsLoading(true);
      try {
        const res = await getCameraDetails(cameraType(type), id + "");
        fetchedDataMap.current.set(markerKey, res.data); // Cache data
        setCameraData(res.data);
      } catch (error) {
        console.error("Error fetching markers:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const debouncedFetchCameraDetails = debounce(fetchCameraDetails, 300);

  return (
    <Marker
      key={`${marker.lat}-${marker.lng}-${marker.cid}`}
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
        dragend: (event) => handleMarkerDragEnd(marker.cid, marker.type, event),

        mouseover: () => {
          fetchCameraDetails(marker.type, marker.cid);
        },
      }}
      type={marker.type}
      statuserror={marker.statuserror}
      icon={L.icon({
        iconUrl: `icons/${marker.icon}`,
        iconSize: marker.type === 2 ? [24, 24] : [40, 40],
      })}
      rotatedAngle={marker.type === 3 ? marker.rotated : 0}
    >
      {isCamera(marker.type) && marker.statuserror !== 2 ? (
        !isLoading &&
        // showPopup &&
        cameraData && (
          <CameraDetails
            t={t}
            isLoading={isLoading}
            marker={marker}
            cameraData={cameraData}
            isPTZ={marker.type === 5}
            L={L}
          />
        )
      ) : (
        <Tooltip direction="top" className="rounded-md">
          <Typography className="my-0">{marker?.cname}</Typography>
          {marker.statuserror === 2 && (
            <Typography className="my-0 text-center text-red-500">
              {t("offline")}
            </Typography>
          )}
        </Tooltip>
      )}
    </Marker>
  );
});

CustomMarker.propTypes = {
  marker: PropTypes.object.isRequired,
  L: PropTypes.object.isRequired,
  isDraggable: PropTypes.bool,
  handleMonitorCrossroad: PropTypes.func,
  handleBoxModalOpen: PropTypes.func,
  handleLightsModalOpen: PropTypes.func,
  handleMarkerDragEnd: PropTypes.func,
};
export default memo(CustomMarker); // CustomMarker;
