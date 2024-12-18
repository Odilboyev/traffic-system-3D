import "./style.popup.css";

import { memo, useEffect, useRef, useState } from "react";

import L from "leaflet";
import { Popup } from "react-leaflet";

const CustomPopup = ({ setShowToolTip, isDraggable, children }) => {
  const [draggableInstance, setDraggableInstance] = useState(null);
  const [isPopupDraggable, setIsPopupDraggable] = useState(isDraggable);

  useEffect(() => {
    setIsPopupDraggable(isDraggable);
    console.log(isDraggable, "isDraggable");
  }, [isDraggable]);
  console.log(isPopupDraggable, "isPopupDraggable");
  return (
    <Popup
      eventHandlers={{
        mouseover: (e) => {
          // Create draggable instance only once when popup opens

          const element = e.target.getElement();
          const draggableRef = new L.Draggable(element);
          setDraggableInstance(draggableRef);
          // Enable or disable dragging based on prop
          if (isPopupDraggable) {
            draggableRef.enable();
            console.log("enabled");
          } else {
            draggableRef.disable();
            console.log("disabled");
          }
        },
        mouseout: (e) => {
          draggableInstance?.disable();
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
