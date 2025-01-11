import React, { useState } from "react";

import Control from "../customControl";
import { FaRoad } from "react-icons/fa";
import { useMap } from "react-leaflet";

const RoadDrawerControl = () => {
  // const map = useMap();
  const [isRoadDrawerEnabled, setIsRoadDrawerEnabled] = useState(false);
  const handleToggleRoadDrawer = () => {
    const newState = !isRoadDrawerEnabled;
    setIsRoadDrawerEnabled(newState);

    // Emit map events to control drawing
    // if (newState) {
    //   map.fire("roadDrawer:start");
    // } else {
    //   map.fire("roadDrawer:stop");
    // }
  };

  return (
    // <Control>
      <button
        className={`leaflet-control-road-drawer ${
          isRoadDrawerEnabled ? "active" : ""
        }`}
        onClick={handleToggleRoadDrawer}
        title="Toggle Road Drawing"
      >
        <FaRoad
          className={`text-xl ${
            isRoadDrawerEnabled ? "text-blue-500" : "text-gray-500"
          }`}
        />
      </button>
    </Control>
  );
};

export default RoadDrawerControl;
