import { Button } from "@material-tailwind/react";
import { memo, useEffect, useRef, useState } from "react";
import { Popup, useMap } from "react-leaflet";
import SingleRecord from "./singleRecord";
import L from "leaflet";
import { isEqual } from "lodash";

const CustomPopUp = memo(function CustomPopup({
  marker = {},
  openPopupData = [],
  setOpenPopupData = () => {},
}) {
  const popupRef = useRef(null);

  return (
    <>
      <Popup
        ref={popupRef}
        interactive
        minWidth={"600px"}
        closeOnClick={false}
        autoClose={false}
        keepInView={true}
        className="p-0 z-[50000000]"
        eventHandlers={{
          mouseover: (e) => {
            const element = e.target.getElement();
            const draggable = new L.Draggable(element);
            draggable.enable();
          },
        }}
      >
        <SingleRecord {...marker} />
      </Popup>
    </>
  );
},
isEqual);
export default CustomPopUp;
