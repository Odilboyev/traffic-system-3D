import { createSlice } from "@reduxjs/toolkit";

// mapSlice.js
const getInitialState = () => ({
  markers: JSON.parse(localStorage.getItem("its_markers")) || [],
  areMarkersLoading:
    JSON.parse(localStorage.getItem("its_areMarkersLoading")) || false,
  errorMessage: JSON.parse(localStorage.getItem("its_errorMessage")) || null,
  filter: JSON.parse(localStorage.getItem("its_filter")) || {
    boxcontroller: true,
    crossroad: true,
    trafficlights: true,
    camera: true,
    cameraview: true,
    camerapdd: true,
  },
  isDraggable: JSON.parse(localStorage.getItem("its_isDraggable")) || false,
  useClusteredMarkers:
    JSON.parse(localStorage.getItem("its_useClusteredMarkers")) || "clustered",
  activeSidePanel:
    JSON.parse(localStorage.getItem("its_activeSidePanel")) || null,
  widgets: JSON.parse(localStorage.getItem("its_widgets")) || {
    bottomsection: true,
    weather: true,
    crossroad: false,
  },
});

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
