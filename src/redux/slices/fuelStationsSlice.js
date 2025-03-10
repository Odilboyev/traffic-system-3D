import { migrateLocalStorage, safeParseJSON } from "../utils";

import { createSlice } from "@reduxjs/toolkit";

// Get initial state with local storage integration
const getInitialState = () => {
  const defaultState = {
    stations: [],
    areStationsLoading: false,
    errorMessage: null,
    filter: {
      petrol: true,
      gas: true,
      electro: true,
    },
    filterOptionsWithTypes: [
      { name: "petrol", type: "petrol" },
      { name: "gas", type: "gas" },
      { name: "electro", type: "electro" },
    ],
    useClusteredView: true,
    showHeatmap: false,
    visibleRadius: 150, // in meters
    selectedStation: null,
    zoomThreshold: 13,
  };

  // Create a prefixed state object for migration
  const prefixedState = {};
  Object.entries(defaultState).forEach(([key, value]) => {
    prefixedState[`fuelStations_${key}`] = value;
  });

  // Migrate localStorage with prefixed keys
  migrateLocalStorage(prefixedState);

  // Return state with values from localStorage or defaults
  return Object.fromEntries(
    Object.entries(defaultState).map(([key, defaultValue]) => [
      key,
      safeParseJSON(`its_fuelStations_${key}`, defaultValue),
    ])
  );
};

export { getInitialState };

export const fuelStationsSlice = createSlice({
  name: "fuelStations",
  initialState: getInitialState(),
  reducers: {
    updateStations: (state, action) => {
      state.stations = action.payload;
    },
    updateLoadingState: (state, action) => {
      state.areStationsLoading = action.payload;
    },
    updateErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    updateFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateUseClusteredView: (state, action) => {
      state.useClusteredView = action.payload;
    },
    updateVisibleRadius: (state, action) => {
      state.visibleRadius = action.payload;
    },
    selectStation: (state, action) => {
      state.selectedStation = action.payload;
    },
    clearSelectedStation: (state) => {
      state.selectedStation = null;
    },
    toggleHeatmap: (state, action) => {
      state.showHeatmap = action.payload;
    },
  },
});

export const {
  updateStations,
  updateLoadingState,
  updateErrorMessage,
  updateFilter,
  updateUseClusteredView,
  updateVisibleRadius,
  selectStation,
  clearSelectedStation,
  toggleHeatmap,
} = fuelStationsSlice.actions;

export default fuelStationsSlice.reducer;
