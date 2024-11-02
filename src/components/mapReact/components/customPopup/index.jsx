import { memo, useState } from "react";
import { Popup } from "react-leaflet";
import SingleRecord from "../singleRecord";
import L from "leaflet";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/16/solid";
import "./popup.style.css";

const DraggablePopup = memo(function DraggablePopup({ marker = {} }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Popup
      eventHandlers={{
        mouseover: (e) => {
          const element = e.target.getElement();
          const draggable = new L.Draggable(element);
          draggable.enable();
        },
      }}
      style={{
        margin: 0,
        padding: 0,
        zIndex: 50000000,
      }}
    >
      <div className="relative w-full h-full transition-all duration-300 ease-in-out">
        <div className="absolute top-2 left-2 z-[11]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="rounded-full text-xs hover:bg-transparent"
          >
            {isZoomed ? (
              <ArrowsPointingInIcon className="w-5 h-5" />
            ) : (
              <ArrowsPointingOutIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <SingleRecord
          mselink={marker?.mselink}
          cname={marker?.cname}
          isZoomed={isZoomed}
        />
      </div>
    </Popup>
  );
});

export default DraggablePopup;
