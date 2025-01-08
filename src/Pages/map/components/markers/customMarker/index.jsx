// MarkerComponent.jsx
import { Marker, Tooltip, useMap } from "react-leaflet";
import { memo, useRef, useState, useMemo } from "react";
import { useTheme } from "../../../../../customHooks/useTheme";

import CameraDetails from "../../customPopup";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { getCameraDetails } from "../../../../../api/api.handlers";

const CustomMarker = memo(function CustomMarker({
  t,
  marker,
  zoom,
  L,
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
  customIcon,
  position,
  disableUpdates = false,
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
  const map = useMap();
  const zoomer = (location) => {
    map.flyTo(location, 19, {
      duration: 0.3,
    });
  };

  const markerIcon = useMemo(() => 
    customIcon || L.icon({
      iconUrl: `icons/${marker.icon}`,
      iconSize: marker.type === 2 ? [22, 22] : [24, 24],
    })
  , [customIcon, marker.icon, marker.type]);

  const markerPosition = useMemo(() => {
    if (position) {
      return position.alt !== undefined ? [position.lat, position.lng, position.alt] : [position.lat, position.lng];
    }
    return [marker.lat, marker.lng];
  }, [position, marker.lat, marker.lng]);

  if (disableUpdates) {
    return null;
  }

  return (
    <Marker
      key={`${marker.lat}-${marker.lng}-${marker.cid}`}
      markerId={marker.cid}
      markerType={marker.type}
      position={markerPosition}
      draggable={isDraggable}
      rotationAngle={marker.rotated}
      eventHandlers={{
        click: () => {
          if (marker.type === 2)
            zoom > 16
              ? handleMonitorCrossroad(marker)
              : zoomer([marker.lat, marker.lng]);
          else if (marker.type === 3) handleBoxModalOpen(marker);
          else if (marker.type === 4) handleLightsModalOpen(marker);
        },
        dragend: (event) => handleMarkerDragEnd(marker.cid, marker.type, event),
        mouseover: () => {
          if (!disableUpdates) {
            fetchCameraDetails(marker.type, marker.cid);
          }
        },
      }}
      type={marker.type}
      statuserror={marker.statuserror}
      icon={markerIcon}
      rotatedAngle={marker.type === 3 ? marker.rotated : 0}
    >
      {!disableUpdates && isCamera(marker.type) && marker.statuserror !== 2 ? (
        !isLoading &&
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
          <Typography className="my-0">{marker?.cname || ""}</Typography>
          {marker.statuserror === 2 && (
            <Typography className="my-0 text-center text-red-500">
              {t("offline") || "Offline"}
            </Typography>
          )}
        </Tooltip>
      )}
    </Marker>
  );
}, (prevProps, nextProps) => {
  if (nextProps.disableUpdates) {
    return true; // Skip update if updates are disabled
  }
  // Only update if essential props changed
  return (
    prevProps.marker.lat === nextProps.marker.lat &&
    prevProps.marker.lng === nextProps.marker.lng &&
    prevProps.marker.statuserror === nextProps.marker.statuserror &&
    prevProps.marker.rotated === nextProps.marker.rotated &&
    prevProps.marker.icon === nextProps.marker.icon &&
    prevProps.zoom === nextProps.zoom
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
  customIcon: PropTypes.object,
  zoom: PropTypes.number,
  t: PropTypes.func,
  position: PropTypes.object,
  disableUpdates: PropTypes.bool,
};

export default memo(CustomMarker);
