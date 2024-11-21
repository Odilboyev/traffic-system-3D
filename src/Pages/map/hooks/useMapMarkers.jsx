import {
  updateErrorMessage,
  updateFilter,
  updateIsDraggable,
  updateLoadingState,
  updateMarkers,
  updateUseClusteredMarkers,
  updateWidgets,
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
  const filter = useSelector((state) => state.map.filter);
  const widgets = useSelector((state) => state.map.widgets);
  const isDraggable = useSelector((state) => state.map.isDraggable);
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

  const setFilter = useCallback(
    (newFilter) => {
      dispatch(updateFilter(newFilter));
    },
    [dispatch]
  );

  const setUseClusteredMarkers = useCallback(
    (newClusteredType) => {
      dispatch(updateUseClusteredMarkers(newClusteredType));
    },
    [dispatch]
  );

  const setWidgets = useCallback(
    (newWidgets) => {
      dispatch(updateWidgets(newWidgets));
    },
    [dispatch]
  );

  const setIsDraggable = useCallback(
    (isDraggableState) => {
      dispatch(updateIsDraggable(isDraggableState));
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
    filter,
    setFilter,
    widgets,
    setWidgets,
    isDraggable,
    setIsDraggable,
  };
};

export { useMapMarkers };
