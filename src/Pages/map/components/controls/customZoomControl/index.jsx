import { IconButton } from "@material-tailwind/react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useMap } from "react-leaflet";
import Control from "../../../../../components/customControl";

const ZoomControl = ({ theme, position, size }) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <Control position={"bottomright"}>
      <div className="flex flex-col ">
        <IconButton
          onClick={handleZoomIn}
          size={size || "lg"}
          className="rounded-b-none"
          color={theme === "light" ? "white" : "black"}
        >
          <FaPlus />
        </IconButton>
        <IconButton
          onClick={handleZoomOut}
          size={size || "lg"}
          className="rounded-t-none "
          color={theme === "light" ? "white" : "black"}
        >
          <FaMinus />
        </IconButton>
      </div>
    </Control>
  );
};

export default ZoomControl;
