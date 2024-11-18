// MarkerComponent.jsx
import { Marker, Tooltip } from "react-leaflet";

import CustomPopup from "../customPopup";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { memo } from "react";

const CustomMarker = memo(function CustomMarker({
  marker,
  L,
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handleLightsModalOpen,
  handleMarkerDragEnd,
}) {
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
      }}
      statuserror={marker.statuserror}
      icon={L.icon({
        iconUrl: `icons/${marker.icon}`,
        iconSize: marker.type === 2 ? [24, 24] : [40, 40],
      })}
      rotatedAngle={marker.type === 3 ? marker.rotated : 0}
    >
      {(marker.type === 1 || marker.type === 5 || marker.type === 6) && (
        <CustomPopup marker={marker} L={L} />
      )}
      <Tooltip direction="top" className="rounded-md">
        {marker.type === 1 || marker.type === 5 || marker.type === 6 ? (
          <div style={{ width: "8vw", height: "6vw", overflow: "hidden" }}>
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
export default CustomMarker;
