import { migrateLocalStorage, safeParseJSON } from "./utils";

import { createSlice } from "@reduxjs/toolkit";

// mapSlice.js
const getInitialState = () => {
  const defaultState = {
    markers: [],
    areMarkersLoading: false,
    errorMessage: null,
    filter: {
      boxcontroller: true,
      crossroad: true,
      trafficlights: true,
      camera: true,
      cameraview: true,
      camerapdd: true,
    },
    isDraggable: false,
    useClusteredMarkers: "clustered",
    activeSidePanel: null,
    widgets: {
      bottomsection: true,
      weather: true,
      time: true,
    },
  };

  migrateLocalStorage(defaultState);

  return Object.fromEntries(
    Object.entries(defaultState).map(([key, defaultValue]) => [
      key,
      safeParseJSON(`its_${key}`, defaultValue),
    ])
  );
};

export { getInitialState };

export const mapSlice = createSlice({
  name: "map",
  initialState: getInitialState(),
  reducers: {
    updateMarkers: (state, action) => {
      state.markers = action.payload;
    },
    updateLoadingState: (state, action) => {
      state.areMarkersLoading = action.payload;
    },
    updateErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    updateFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateUseClusteredMarkers: (state, action) => {
      state.useClusteredMarkers = action.payload;
    },
    updateActiveSidePanel: (state, action) => {
      state.activeSidePanel = action.payload;
    },
    updateWidgets: (state, action) => {
      state.widgets = action.payload;
    },
    updateIsDraggable: (state, action) => {
      state.isDraggable = action.payload;
    },
  },
});

export const {
  updateMarkers,
  updateLoadingState,
  updateErrorMessage,
  updateFilter,
  updateUseClusteredMarkers,
  updateActiveSidePanel,
  updateWidgets,
  updateIsDraggable,
} = mapSlice.actions;

export default mapSlice.reducer;
