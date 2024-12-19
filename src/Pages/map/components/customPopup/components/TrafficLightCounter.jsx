import { memo } from "react";
import { useSelector } from "react-redux";
const TrafficLightCounter = memo(
  ({ channelId }) => {
    const cameraData = useSelector((state) =>
      state.trafficLightSeconds.cameras.find(
        (cam) => cam.camera_id === channelId
      )
    );
    if (!cameraData) return null;

    return (
      <div
        className={`w-3/4 flex items-center rounded-lg font-bold justify-center text-2xl w-full py-1 ${
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
  },
  (prevProps, nextProps) => {
    // Prevent unnecessary re-renders
    return (
      prevProps.channelId === nextProps.channelId &&
      prevProps.seconds === nextProps.seconds &&
      prevProps.status === nextProps.status
    );
  }
);

export default TrafficLightCounter;
