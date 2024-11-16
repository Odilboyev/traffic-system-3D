import "./popup.style.css";

import { memo, useRef } from "react";

import { Popup } from "react-leaflet";
import SingleRecord from "../singleRecord";

const CustomPopup = ({ marker = {}, L }) => {
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
      className="!p-0 !m-0 z-[50000000] select-none custom-popup text-white"
    >
      <SingleRecord mselink={marker?.mselink} cname={marker?.cname} />
    </Popup>
  );
};

export default memo(CustomPopup);
