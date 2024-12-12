import { FaMinus, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";

import Control from "../../../../../components/customControl";
import { IconButton } from "@material-tailwind/react";
import { useMap } from "react-leaflet";

const ZoomControl = ({ theme, position, size }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  // Add event listeners to track zoom changes
  useEffect(() => {
    const handleZoomEnd = () => {
      setZoom(map.getZoom());
    };

    map.on("zoomend", handleZoomEnd);

    // Cleanup the event listener
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <Control position={position || "bottomright"}>
      <div className="flex flex-col ">
        <IconButton
          onClick={handleZoomIn}
          size={size || "lg"}
          className="rounded-b-none"
          color={theme === "light" ? "white" : "black"}
        >
          <FaPlus />
        </IconButton>
        <div className="text-center py-2 backdrop-blur-md dark:bg-gray-900/80 bg-white/50 dark:text-white text-gray-900 font-bold">
          {zoom}
        </div>
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
