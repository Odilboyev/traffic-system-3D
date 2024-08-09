import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

const Control = (props) => {
  const [container, setContainer] = useState(document.createElement("div"));
  const positionClass =
    (props.position && POSITION_CLASSES[props.position]) ||
    POSITION_CLASSES.topright;

  useEffect(() => {
    const targetDiv = document.getElementsByClassName(positionClass);
    setContainer(targetDiv[0]);
  }, []);

  const controlContainer = (
    <div className="leaflet-control leaflet-bar leaflet-center">
      {props.children}
    </div>
  );

  L.DomEvent.disableClickPropagation(container);

  return createPortal(controlContainer, container);
};

export default Control;
