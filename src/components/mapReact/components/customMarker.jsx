// MarkerComponent.jsx
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Typography } from "@material-tailwind/react";
import CustomPopUp from "./customPopup";
import { memo } from "react";

const MarkerComponent = ({
  marker,
  isDraggable,
  handleMarkerDragEnd,
  handlePopupOpen,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
}) => {
  const markerIcon = L.icon({
    iconUrl: `icons/${marker.icon}`,
    iconSize: [32, 32],
  });

  const handleClick = () => {
    if (marker.type == 2) {
      handleMonitorCrossroad(marker);
    } else if (marker.type == 3) {
      handleBoxModalOpen(marker);
    } else if (marker.type == 4) {
      handleLightsModalOpen(marker);
    } else {
      handlePopupOpen(marker);
    }
  };

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      draggable={isDraggable}
      rotationAngle={marker.rotated}
      eventHandlers={{
        click: handleClick,
        dragend: (event) => handleMarkerDragEnd(marker.cid, marker.type, event),
      }}
      icon={markerIcon}
      rotatedAngle={marker.type === 3 ? marker.rotated : 0}
    >
      {marker.type === 1 && <CustomPopUp marker={marker} />}
      <Tooltip direction="top">
        {marker.type == 1 && (
          <div className="w-[30vw]">
            <img
              src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
              className="w-full"
              alt=""
            />
          </div>
        )}
        <Typography>{marker?.cname}</Typography>
      </Tooltip>
    </Marker>
  );
};

export default memo(MarkerComponent);
