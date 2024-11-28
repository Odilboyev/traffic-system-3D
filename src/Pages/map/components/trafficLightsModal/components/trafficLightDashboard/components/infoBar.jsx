import { AiOutlineClose } from "react-icons/ai";
import { IconButton } from "@material-tailwind/react";

const InfoBarTrafficDash = ({ info, phase, config, onClose }) => {
  return (
    <div className="w-1/4 h-full bg-white shadow-lg dark:bg-gray-800 dark:text-white p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Traffic Dashboard Info</h2>
        <IconButton size="sm" onClick={onClose}>
          <AiOutlineClose
            className="text-gray-600 dark:text-white hover:text-red-500"
            size={24}
          />
        </IconButton>
      </div>

      <div className="space-y-4">
        {/* Other info fields */}
        {Object.entries(info).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="font-medium capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span>{value || "N/A"}</span>
          </div>
        ))}
      </div>
      <TrafficStages phase={phase} config={config} />
    </div>
  );
};

export default InfoBarTrafficDash;

// A simple function to create stage icons
const StageIcon = ({ active, direction }) => {
  return (
    <div
      className={`w-24 h-24 flex justify-center items-center border-2 ${
        active ? "border-yellow-500 font-bold" : "border-gray-400"
      }`}
    >
      <span
        className={`text-lg ${active ? "text-yellow-500" : "text-gray-500"}`}
      >
        {direction}
      </span>
    </div>
  );
};

const TrafficStages = ({ phase, config }) => {
  // Function to dynamically determine active directions
  const getActiveSides = (phase, config) => {
    const activeChannels = phase.activeChannels || []; // Assuming active channels are provided in phase
    const sides = ["east", "west", "north", "south"];
    const activeSides = {};

    sides.forEach((side) => {
      const sideConfig = config[side];
      if (sideConfig) {
        // Collect all channel IDs for this side
        const sideChannelIds = [
          ...(sideConfig.lanesLeft?.flat().map((lane) => lane.channel_id) ||
            []),
          ...(sideConfig.lanesRight?.map((lane) => lane.channel_id) || []),
          sideConfig.cross_walkLeft?.channel_id,
          sideConfig.cross_walkRight?.channel_id,
        ].filter(Boolean); // Remove undefined/null values

        // Check if any channel ID for this side is active
        activeSides[side] = sideChannelIds.some((channelId) =>
          activeChannels.includes(channelId)
        );
      }
    });

    return activeSides;
  };

  const activeSides = getActiveSides(phase, config);

  return (
    <div className="flex space-x-4 p-4">
      <div className="flex flex-col items-center">
        <StageIcon
          active={activeSides.east || activeSides.west}
          direction="East/West"
        />
        <span className="text-sm">Active</span>
      </div>
      <div className="flex flex-col items-center">
        <StageIcon
          active={activeSides.north || activeSides.south}
          direction="North/South"
        />
        <span className="text-sm">Active</span>
      </div>
    </div>
  );
};
