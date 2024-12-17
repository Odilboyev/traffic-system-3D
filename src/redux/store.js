import { configureStore } from "@reduxjs/toolkit";
import localStorageMiddleware from "./middleware";
import mapReducer from "./slices/mapslice"; // Path to your slice
import trafficLightSecondsReducer from "./slices/trafficLightSecondsSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    trafficLightSeconds: trafficLightSecondsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
