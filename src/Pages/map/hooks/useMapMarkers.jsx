import { getAllMarkers, getMarkerData } from "../../../api/api.handlers";
import {
  updateErrorMessage,
  updateLoadingState,
  updateMarkers,
  updateUseClusteredMarkers,
} from "../../../redux/slices/mapslice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMapMarkers = () => {
  const dispatch = useDispatch();

  // Access state from Redux
  const markers = useSelector((state) => state.map.markers);
  const areMarkersLoading = useSelector((state) => state.map.areMarkersLoading);
  const errorMessage = useSelector((state) => state.map.errorMessage);
  const useClusteredMarkers = useSelector(
    (state) => state.map.useClusteredMarkers
  );
  const isHighQuality = useSelector((state) => state.map.isHighQuality);

  // Action to fetch data
  const getDataHandler = useCallback(async () => {
    dispatch(updateLoadingState(true));
    try {
      const response = await getMarkerData();
      console.log("Fetched marker data:", response);
      if (response?.data) {
        console.log("Formatted markers:", response.data);
        dispatch(updateMarkers(response.data));
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
      if (error.code === "ERR_NETWORK") {
        dispatch(updateErrorMessage("You are offline. Please try again"));
      } else {
        dispatch(updateErrorMessage("Failed to fetch markers"));
      }
    } finally {
      dispatch(updateLoadingState(false));
    }
  }, [dispatch]);

  const clearMarkers = useCallback(() => {
    dispatch(updateMarkers([]));
  }, [dispatch]);

  const setMarkers = useCallback(
    (data) => {
      if (data) {
        dispatch(updateMarkers(data));
      }
    },
    [dispatch]
  );

  const setUseClusteredMarkers = useCallback(
    (value) => {
      dispatch(updateUseClusteredMarkers(value));
    },
    [dispatch]
  );

  return {
    markers,
    areMarkersLoading,
    errorMessage,
    isHighQuality,
    getDataHandler,
    clearMarkers,
    setMarkers,
    useClusteredMarkers,
    setUseClusteredMarkers,
  };
};

export { useMapMarkers };
