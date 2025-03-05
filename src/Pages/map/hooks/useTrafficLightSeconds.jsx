import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTrafficLightSeconds } from "../../../redux/slices/trafficLightSecondsSlice";

const useTrafficLightSeconds = () => {
  const dispatch = useDispatch();

  // Access state from Redux
  const cameras = useSelector((state) => state.trafficLightSeconds.cameras);

  // Find a specific camera by ID
  const getCameraById = useCallback(
    (cameraId) => {
      return cameras.find((cam) => cam.camera_id === cameraId) || null;
    },
    [cameras]
  );

  // Update traffic light data
  const updateTrafficLight = useCallback(
    (cameraId, countdown, status) => {
      dispatch(
        updateTrafficLightSeconds({
          camera_id: cameraId,
          countdown,
          status,
        })
      );
    },
    [dispatch]
  );

  // Clear all traffic light data
  const clearTrafficLights = useCallback(() => {
    // Since the slice doesn't have a clear action, we can implement it here
    // by dispatching an empty array or adding a clear action to the slice
    // For now, we'll just return the function
    console.warn("clearTrafficLights function is not implemented in the slice");
  }, []);

  return {
    cameras,
    getCameraById,
    updateTrafficLight,
    clearTrafficLights,
  };
};

export { useTrafficLightSeconds };
