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
        className={`flex items-center font-bold justify-center text-2xl w-full p-2 ${
          cameraData.status === 1
            ? "bg-green-500/40 text-green-300"
            : cameraData.status === 9 || cameraData.status === 3
            ? "bg-yellow-500/40 text-yellow-300"
            : "bg-red-500/40 text-red-300"
        }`}
      >
        {cameraData.countdown}
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
