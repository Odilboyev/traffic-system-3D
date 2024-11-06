import L from "leaflet";
import { memo, useRef } from "react";
import { Popup } from "react-leaflet";
import SingleRecord from "../singleRecord";
import "./popup.style.css";
const CustomPopup = memo(function CustomPopup({ marker = {} }) {
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
      className="!p-0 !m-0 z-[50000000] select-none custom-popup"
    >
      <SingleRecord mselink={marker?.mselink} cname={marker?.cname} />
    </Popup>
  );
});

export default CustomPopup;
