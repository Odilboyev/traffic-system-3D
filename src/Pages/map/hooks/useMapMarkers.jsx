import {
  updateErrorMessage,
  updateLoadingState,
  updateMarkers,
  updateUseClusteredMarkers,
} from "../../../redux/mapSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMarkerData } from "../../../api/api.handlers";

// Adjust the import path

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
      const myData = await getMarkerData();
      dispatch(
        updateMarkers(
          myData.data.map((marker) => ({ ...marker, isPopupOpen: false }))
        )
      );
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        dispatch(updateErrorMessage("You are offline. Please try again"));
      }
      console.error(error);
    } finally {
      dispatch(updateLoadingState(false));
    }
  }, [dispatch]);
  useEffect(() => {
    getDataHandler();
  }, []);

  const clearMarkers = useCallback(() => {
    dispatch(updateMarkers([]));
  }, [dispatch]);

  const setMarkers = useCallback(
    (data) => {
      if (data) dispatch(updateMarkers(data));
    },
    [dispatch]
  );

  const setUseClusteredMarkers = useCallback(
    (newClusteredType) => {
      dispatch(updateUseClusteredMarkers(newClusteredType));
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
