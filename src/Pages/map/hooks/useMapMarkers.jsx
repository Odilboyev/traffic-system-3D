import { createContext, useContext, useState, useCallback } from "react";
import { getMarkerData } from "../../../api/api.handlers";
import { role } from "../constants/roles";
import useLocalStorageState from "../../../customHooks/uselocalStorageState";

// Create the context
const MapMarkersContext = createContext();

// Create the provider component
export const MapMarkersProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [useClusteredMarkers, setUseClusteredMarkers] = useLocalStorageState(
    "its_cluster_type",
    role === "boss"
      ? "clustered"
      : role === "operator"
      ? "dynamic"
      : "clustered_dynamically"
  );
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
    crossroad: false,
  });

  const [isDraggable, setIsDraggable] = useLocalStorageState(
    "traffic_isDraggable",
    false
  );
  const getDataHandler = useCallback(async () => {
    setAreMarkersLoading(true);
    try {
      const myData = await getMarkerData();
      setMarkers(
        myData.data.map((marker) => ({
          ...marker,
          isPopupOpen: false,
        }))
      );
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setErrorMessage("You are offline. Please try again");
      }
      console.error(error);
    } finally {
      setAreMarkersLoading(false);
    }
  }, []);

  const clearMarkers = useCallback(() => setMarkers([]), []);
  const updateMarkers = useCallback((data) => {
    if (data) setMarkers(data);
  }, []);

  return (
    <MapMarkersContext.Provider
      value={{
        markers,
        setMarkers,
        areMarkersLoading,
        errorMessage,
        getDataHandler,
        clearMarkers,
        updateMarkers,
        useClusteredMarkers,
        setUseClusteredMarkers,
        activeSidePanel,
        setActiveSidePanel,
        filter,
        setFilter,
        widgets,
        setWidgets,
        isDraggable,
        setIsDraggable,
      }}
    >
      {children}
    </MapMarkersContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMapMarkers = () => useContext(MapMarkersContext);
