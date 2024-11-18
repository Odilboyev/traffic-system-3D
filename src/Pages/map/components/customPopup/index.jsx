import "./popup.style.css";

import { memo, useRef } from "react";

import { Popup } from "react-leaflet";
import SingleRecord from "./singleRecord";

const CustomPopup = memo(
  function CustomPopup({ marker = {}, L }) {
    const popupRef = useRef(null);

    return (
      <Popup
        eventHandlers={{
          mouseover: (e) => {
            const element = e.target.getElement();
            const draggable = new L.Draggable(element);
            draggable.enable();
          },
        }}
        ref={popupRef}
        maxWidth={"100%"}
        minHeight={"100%"}
        interactive
        closeOnClick={false}
        autoClose={false}
        keepInView={false}
        autoPan={false}
        className="!p-0 !m-0 z-[50000000] select-none custom-popup text-white"
      >
        <SingleRecord mselink={marker?.mselink} cname={marker?.cname} />
      </Popup>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if marker data changes
    return (
      prevProps.marker.cid === nextProps.marker.cid &&
      prevProps.marker.type === nextProps.marker.type
    );
  }
);

export default CustomPopup;
