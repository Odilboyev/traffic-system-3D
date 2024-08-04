import { PlusIcon } from "@heroicons/react/16/solid";
import { IconButton } from "@material-tailwind/react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useMap } from "react-leaflet";
import Control from "react-leaflet-custom-control";

const ZoomControl = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <Control position="topleft">
      <div className="flex flex-col">
        <IconButton onClick={handleZoomIn} size="lg" className="rounded-b-none">
          <FaPlus />
        </IconButton>
        <IconButton
          onClick={handleZoomOut}
          size="lg"
          className="rounded-t-none "
        >
          <FaMinus />
        </IconButton>
      </div>
    </Control>
  );
};

export default ZoomControl;
