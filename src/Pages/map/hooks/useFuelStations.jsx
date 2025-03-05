import {
  clearSelectedStation,
  selectStation,
  updateErrorMessage,
  updateFilter,
  updateLoadingState,
  updateStations,
  updateUseClusteredView,
  updateVisibleRadius,
} from "../../../redux/slices/fuelStationsSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getFuelStations } from "../../../api/api.handlers";

/**
 * Custom hook for managing fuel stations data and state
 * @returns {Object} Functions and state for fuel stations management
 */
const useFuelStations = () => {
  const dispatch = useDispatch();
  const zoomThreshold = useSelector(
    (state) => state.fuelStations.zoomThreshold
  );
  // Access state from Redux
  const stations = useSelector((state) => state.fuelStations.stations);
  const areStationsLoading = useSelector(
    (state) => state.fuelStations.areStationsLoading
  );
  const errorMessage = useSelector((state) => state.fuelStations.errorMessage);
  const filter = useSelector((state) => state.fuelStations.filter);
  const filterOptionsWithTypes = useSelector(
    (state) => state.fuelStations.filterOptionsWithTypes
  );
  const useClusteredView = useSelector(
    (state) => state.fuelStations.useClusteredView
  );
  const visibleRadius = useSelector(
    (state) => state.fuelStations.visibleRadius
  );
  const selectedStation = useSelector(
    (state) => state.fuelStations.selectedStation
  );

  // Action to fetch fuel stations data
  const fetchStations = useCallback(async () => {
    dispatch(updateLoadingState(true));
    try {
      const response = await getFuelStations();
      console.log("Fetched fuel stations:", response);
      if (response) {
        dispatch(updateStations(response));
      } else {
        dispatch(updateStations([]));
      }
    } catch (error) {
      console.error("Error fetching fuel stations:", error);
      if (error.code === "ERR_NETWORK") {
        dispatch(updateErrorMessage("You are offline. Please try again"));
      } else {
        dispatch(updateErrorMessage("Failed to fetch fuel stations"));
      }
    } finally {
      dispatch(updateLoadingState(false));
    }
  }, [dispatch]);

  // Clear all stations
  const clearStations = useCallback(() => {
    dispatch(updateStations([]));
  }, [dispatch]);

  // Set stations directly
  const setStations = useCallback(
    (data) => {
      if (data) {
        dispatch(updateStations(data));
      }
    },
    [dispatch]
  );

  // Update filter settings
  const setFilter = useCallback(
    (newFilter) => {
      dispatch(updateFilter(newFilter));
    },
    [dispatch]
  );

  // Toggle a specific filter
  const toggleFilter = useCallback(
    (filterName) => {
      const newFilter = { ...filter };
      newFilter[filterName] = !newFilter[filterName];
      dispatch(updateFilter(newFilter));
    },
    [filter, dispatch]
  );

  // Set clustered view mode
  const setUseClusteredView = useCallback(
    (value) => {
      dispatch(updateUseClusteredView(value));
    },
    [dispatch]
  );

  // Update visible radius for stations
  const setVisibleRadius = useCallback(
    (radius) => {
      dispatch(updateVisibleRadius(radius));
    },
    [dispatch]
  );

  // Select a specific station
  const setSelectedStation = useCallback(
    (station) => {
      dispatch(selectStation(station));
    },
    [dispatch]
  );

  // Clear selected station
  const clearSelectedStation = useCallback(() => {
    dispatch(clearSelectedStation());
  }, [dispatch]);

  // Get filtered stations based on current filter settings
  const getFilteredStations = useCallback(() => {
    if (!stations || !stations.length) return [];

    return stations.filter((station) => {
      // If station has no type, default to "petrol"
      const stationType = station.type || "petrol";
      return filter[stationType] === true;
    });
  }, [stations, filter]);

  return {
    stations,
    areStationsLoading,
    errorMessage,
    filter,
    filterOptionsWithTypes,
    useClusteredView,
    visibleRadius,
    selectedStation,
    fetchStations,
    clearStations,
    setStations,
    setFilter,
    toggleFilter,
    setUseClusteredView,
    setVisibleRadius,
    setSelectedStation,
    clearSelectedStation,
    getFilteredStations,
    zoomThreshold,
  };
};

export { useFuelStations };
