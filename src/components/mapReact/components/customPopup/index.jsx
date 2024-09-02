import { memo, useEffect, useRef } from "react";
import { Popup } from "react-leaflet";
import SingleRecord from "../singleRecord";
import L from "leaflet";

const DraggablePopup = memo(function DraggablePopup({ marker = {} }) {
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
      // eventHandlers={{ close: onClose }}
      maxWidth={"100%"}
      minHeight={"100%"}
      interactive
      closeOnClick={false}
      autoClose={false}
      keepInView={false} // Change this to false
      autoPan={false}
      className="m-0 !p-0 z-[50000000] select-none !rounded-lg"
    >
      <SingleRecord mselink={marker?.mselink} cname={marker?.cname} />
    </Popup>
  );
});

export default DraggablePopup;
