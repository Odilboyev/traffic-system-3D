import { configureStore } from "@reduxjs/toolkit";
import localStorageMiddleware from "./middleware";
import mapReducer from "./mapSlice"; // Path to your slice

export const store = configureStore({
  reducer: {
    map: mapReducer, // This is where your map state is managed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
