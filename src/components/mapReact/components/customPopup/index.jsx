import { memo, useEffect, useRef } from "react";
import { Popup } from "react-leaflet";
import SingleRecord from "../singleRecord";

const DraggablePopup = memo(function DraggablePopup({
  marker = {},
  onClose = () => {},
  id,
}) {
  return (
    <Popup
      // ref={popupRef}
      eventHandlers={{ close: onClose }}
      maxWidth={"100%"}
      interactive
      closeOnClick={false}
      autoClose={false}
      keepInView={true}
      className="m-0 !p-0 z-[50000000] select-none"
    >
      <SingleRecord mselink={marker?.mselink} cname={marker?.cname} />
    </Popup>
  );
});

export default DraggablePopup;
