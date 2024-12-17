import { createSlice } from "@reduxjs/toolkit";

const trafficLightSecondsSlice = createSlice({
  name: "trafficLightSeconds",
  initialState: {
    cameras: [],
  },
  reducers: {
    updateTrafficLightSeconds: (state, action) => {
      const { camera_id, countdown, status } = action.payload;

      // Find existing camera or add new
      const existingCameraIndex = state.cameras.findIndex(
        (cam) => cam.camera_id === camera_id
      );

      if (existingCameraIndex !== -1) {
        // Update existing camera
        state.cameras[existingCameraIndex] = {
          camera_id,
          countdown,
          status,
        };
      } else {
        // Add new camera
        state.cameras.push({
          camera_id,
          countdown,
          status,
        });
      }
    },
  },
});

export const { updateTrafficLightSeconds } = trafficLightSecondsSlice.actions;
export default trafficLightSecondsSlice.reducer;
