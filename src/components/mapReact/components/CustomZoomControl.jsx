import { PlusIcon } from "@heroicons/react/16/solid";
import { IconButton } from "@material-tailwind/react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";

const ZoomControl = ({ theme, position }) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <Control position={position || "topleft"}>
      <div className="flex flex-col">
        <IconButton
          onClick={handleZoomIn}
          size="lg"
          className="rounded-b-none"
          color={theme === "light" ? "black" : "white"}
        >
          <FaPlus />
        </IconButton>
        <IconButton
          onClick={handleZoomOut}
          size="lg"
          className="rounded-t-none "
          color={theme === "light" ? "black" : "white"}
        >
          <FaMinus />
        </IconButton>
      </div>
    </Control>
  );
};

export default ZoomControl;