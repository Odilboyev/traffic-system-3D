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
      cameratrafic: true,
      cameraview: true,
      camerapdd: true,
    },
    isDraggable: false,
    isHighQuality: false,
    useClusteredMarkers: "clustered",
    // language: "ru",
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

    updateWidgets: (state, action) => {
      state.widgets = action.payload;
    },
    updateIsDraggable: (state, action) => {
      state.isDraggable = action.payload;
    },
    updateIsHighQuality: (state, action) => {
      state.isHighQuality = action.payload;
    },
    // updateLanguage: (state, action) => {
    //   state.language = action.payload;
    // },
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
  updateIsHighQuality,
  // updateLanguage,
} = mapSlice.actions;

export default mapSlice.reducer;
