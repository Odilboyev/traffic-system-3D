import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ZoomPanelContext = createContext();

export const ZoomPanelProvider = ({ children, map, condition }) => {
  const [conditionMet, setConditionMet] = useState(false);
  const handleZoomChange = useCallback(() => {
    if (!map) return;

    const zoom = Math.floor(map.getZoom());
    if (zoom === condition) {
      setConditionMet(true);
    } else {
      setConditionMet(false);
    }
  }, [map, condition]);

  useEffect(() => {
    if (!map) return;

    map.on("zoom", handleZoomChange);

    // Initial check
    handleZoomChange();

    return () => {
      map.off("zoom", handleZoomChange);
    };
  }, [map, handleZoomChange]);

  return (
    <ZoomPanelContext.Provider
      value={{
        conditionMet,
      }}
    >
      {children}
    </ZoomPanelContext.Provider>
  );
};

export const useZoomPanel = (condition) => {
  const context = useContext(ZoomPanelContext);
  if (!context) {
    throw new Error("useZoomPanel must be used within a ZoomPanelProvider");
  }
  return context.conditionMet;
};
