import {
  updateErrorMessage,
  updateLoadingState,
  updateMarkers,
  updateUseClusteredMarkers,
} from "../../../redux/slices/mapslice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllMarkers } from "../../../api/api.handlers";

const useMapMarkers = () => {
  const dispatch = useDispatch();

  // Access state from Redux
  const markers = useSelector((state) => state.map.markers);
  const areMarkersLoading = useSelector((state) => state.map.areMarkersLoading);
  const errorMessage = useSelector((state) => state.map.errorMessage);
  const useClusteredMarkers = useSelector(
    (state) => state.map.useClusteredMarkers
  );

  // Action to fetch data
  const getDataHandler = useCallback(async () => {
    dispatch(updateLoadingState(true));
    try {
      const response = await getAllMarkers();
      console.log("Fetched marker data:", response);
      if (response?.data) {
        const formattedMarkers = response.data.map((marker) => ({
          id: marker.id || Date.now() + Math.floor(Math.random() * 1000000),
          lat: parseFloat(marker.lat || marker.latitude),
          link_id: marker.link_id || 0,
          lng: parseFloat(marker.lng || marker.longitude),
          rotate: marker.rotate || 0,
          svetofor_id: marker.svetofor_id?.toString() || "0",
          type: marker.type || 2,
          countdown: marker.countdown || 0,
        }));
        console.log("Formatted markers:", formattedMarkers);
        dispatch(updateMarkers(formattedMarkers));
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
        const formattedMarkers = data.map((marker) => ({
          id: marker.id || Date.now() + Math.floor(Math.random() * 1000000),
          lat: parseFloat(marker.lat || marker.latitude),
          link_id: marker.link_id || 0,
          lng: parseFloat(marker.lng || marker.longitude),
          rotate: marker.rotate || 0,
          svetofor_id: marker.svetofor_id?.toString() || "0",
          type: marker.type || 2,
          countdown: marker.countdown || 0,
        }));
        dispatch(updateMarkers(formattedMarkers));
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
    getDataHandler,
    clearMarkers,
    setMarkers,
    useClusteredMarkers,
    setUseClusteredMarkers,
  };
};

export { useMapMarkers };
