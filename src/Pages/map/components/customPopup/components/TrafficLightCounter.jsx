import { ReduxProvider } from "../../../../../redux/ReduxProvider";
import { memo, useCallback } from "react";
import { useTrafficLightSeconds } from "../../../hooks/useTrafficLightSeconds";

// Inner component that uses the hook
const TrafficLightCounterContent = memo(({ channelId }) => {
  const { cameras, getCameraById } = useTrafficLightSeconds();
  const cameraData = getCameraById(channelId);
  
  // Remove console.log to prevent unnecessary work during renders
  if (!cameraData) return null;

  return (
    <div
      className={`flex items-center rounded-lg font-bold justify-center text-2xl w-full py-1 ${
        cameraData.status === 1
          ? "dark:bg-green-500/40 dark:text-green-300 bg-green-500/40 text-green-300"
          : cameraData.status === 9 || cameraData.status === 3
          ? "dark:bg-yellow-500/40 dark:text-yellow-300 bg-yellow-500/40 text-yellow-700"
          : "dark:bg-red-500/40 dark:text-red-300 bg-red-500/40 text-red-300"
      }`}
    >
      <div className="mx-2">{cameraData.countdown}</div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if channelId changes
  return prevProps.channelId === nextProps.channelId;
});

// Wrapper component that provides the Redux store
const TrafficLightCounter = memo((props) => (
  <ReduxProvider>
    <TrafficLightCounterContent {...props} />
  </ReduxProvider>
), (prevProps, nextProps) => {
  // Only re-render if channelId changes
  return prevProps.channelId === nextProps.channelId;
});

export default TrafficLightCounter;
