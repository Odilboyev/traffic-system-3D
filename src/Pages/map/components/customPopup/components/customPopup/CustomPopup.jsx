import "./style.popup.css";

import { memo, useEffect, useRef, useState } from "react";

import L from "leaflet";
import { Popup } from "react-leaflet";

const CustomPopup = ({ setShowToolTip, isDraggable, children }) => {
  const draggableRef = useRef(null);
  const popupElementRef = useRef(null);

  useEffect(() => {
    // Ensure draggable instance exists and update its state
    if (popupElementRef.current && isDraggable) {
      if (!draggableRef.current) {
        draggableRef.current = new L.Draggable(popupElementRef.current);
      }
      draggableRef.current.enable();
    } else if (draggableRef.current) {
      draggableRef.current.disable();
    }
  }, [isDraggable]);

  return (
    <Popup
      eventHandlers={{
        mouseover: (e) => {
          // Store the popup element for dragging
          popupElementRef.current = e.target.getElement();

          // Create and manage draggable instance
          if (isDraggable) {
            if (!draggableRef.current) {
              draggableRef.current = new L.Draggable(popupElementRef.current);
            }
            draggableRef.current.enable();
          }
        },
        mouseout: () => {
          // Disable dragging on mouseout if not draggable
          if (!isDraggable && draggableRef.current) {
            draggableRef.current.disable();
          }
        },
        popupopen: (e) => {
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
      draggable={false} // Explicitly set to false to use our custom dragging
      className="!p-0 !m-0 z-[50000000] custom-popup text-white custom-popup-no-tip"
    >
      {children}
    </Popup>
  );
};

export default memo(CustomPopup);
