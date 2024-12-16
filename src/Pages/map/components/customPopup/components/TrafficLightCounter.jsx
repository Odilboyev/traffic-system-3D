import React, { memo } from "react";

const TrafficLightCounter = memo(
  ({ channelId, seconds, status, t }) => {
    return (
      <div
        className={`flex items-center font-bold justify-center text-2xl w-full p-2  rounded-b-xl  ${
          status === 1
            ? "bg-green-500/40 text-green-300"
            : status === 9 || status === 3
            ? "bg-yellow-500/40 text-yellow-300"
            : "bg-red-500/40 text-red-300"
        }`}
      >
        {seconds}
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
