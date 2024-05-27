import React, { memo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import CustomPopUp from "./customPopup";
import { isEqual } from "lodash";
const CustomMarker = memo(function CustomMarker({
  marker = {},
  isDraggable,
  handleMonitorCrossroad,
  handleBoxModalOpen,
  handlePopupOpen,
  handleMarkerDragEnd,
}) {
  return (
    <Marker
      // ref={(ref) =>
      //   (markerRefs[`${marker.cid}-${marker.type}`] = ref)
      // }
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
            : () => handlePopupOpen(marker),
        dragend: (event) => handleMarkerDragEnd(marker.cid, marker.type, event),
        // popupopen: () => handleRotate(marker.id),
      }}
      statuserror={marker.statuserror}
      icon={L.icon({
        iconUrl: `icons/${marker.icon}`,
        iconSize: [32, 32],
      })}
      rotatedAngle={marker.type === 3 ? marker.rotated : 0}
    >
      {" "}
      {/* <Fragment key={i}>
                  {marker.type !== 2 && marker.type !== 3 && (
                    <Popup
                      interactive
                      minWidth={"600px"}
                      closeOnClick={false}
                      autoClose={false}
                      keepInView
                      className="p-0"
                      eventHandlers={{
                        mouseover: (e) => {
                          const element = e.target.getElement();
                          const draggable = new L.Draggable(element);
                          draggable.enable();
                        },
                      }}
                    >
                      {marker.type === 1 ? (
                        <SingleRecord {...marker} />
                      ) : (
                        <div>default</div>
                      )}
                    </Popup>
                  )}
                </Fragment> */}
      {marker.type === 1 && <CustomPopUp marker={marker} />}
      {marker.type == 1 && (
        <Tooltip direction="top">
          <div className="w-[30vw]">
            <img
              src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
              className="w-full"
              alt=""
            />
          </div>
        </Tooltip>
      )}
    </Marker>
  );
});
// function checkTheValue(prevValue, newValue) {
//   prevValue.marker.statuserror == newValue.marker.statuserror ? true : false;
// }

export default CustomMarker;
