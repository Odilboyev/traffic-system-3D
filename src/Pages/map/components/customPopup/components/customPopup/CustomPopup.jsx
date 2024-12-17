import "./style.popup.css";

import React, { memo } from "react";

import { Popup } from "react-leaflet";

const CustomPopup = ({ popupRef, setShowToolTip, children }) => {
  return (
    <Popup
      key="fixed-popup"
      ref={(popup) => {
        popupRef.current = popup;
      }}
      eventHandlers={{
        mouseover: (e) => {
          const element = e.target.getElement();
          const draggable = new L.Draggable(element);
          draggable.enable();
        },
        popupopen: () => {
          setShowToolTip(false);
        },
        popupclose: () => {
          setShowToolTip(true);
        },
      }}
      maxWidth={"100%"}
      minHeight={"100%"}
      height={"100%"}
      interactive
      closeOnClick={false}
      autoClose={false}
      keepInView={false}
      autoPan={false}
      draggable
      className="!p-0 !m-0 z-[50000000] custom-popup text-white custom-popup-no-tip"
    >
      {children}
    </Popup>
  );
};

export default memo(CustomPopup);
