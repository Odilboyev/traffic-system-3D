import { useState } from "react";
import useLocalStorageState from "../../../customHooks/uselocalStorageState";

export const useMapControls = () => {
  const [activeSidePanel, setActiveSidePanel] = useState(null);

  const [filter, setFilter] = useLocalStorageState("traffic_filter", {
    box: true,
    crossroad: true,
    trafficlights: true,
    // signs: true,
    camera: true,
    cameraview: true,
    camerapdd: true,
  });

  const [widgets, setWidgets] = useLocalStorageState("traffic_widgets", {
    bottomsection: true,
    weather: true,
  });

  const [isDraggable, setIsDraggable] = useLocalStorageState(
    "traffic_isDraggable",
    false
  );

  return {
    activeSidePanel,
    setActiveSidePanel,
    filter,
    setFilter,
    widgets,
    setWidgets,
    isDraggable,
    setIsDraggable,
  };
};
