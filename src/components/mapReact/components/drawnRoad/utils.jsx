import {
  TbArrowBack,
  TbArrowBackUp,
  TbArrowDown,
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowUp,
} from "react-icons/tb";

export const iconOptions = [
  { name: "Right Ramp", icon: <TbArrowRampRight />, value: "TbArrowRampRight" },
  { name: "Arrow Up", icon: <TbArrowUp />, value: "TbArrowUp" },
  {
    name: "Arrow Back Up",
    icon: <TbArrowBackUp className="-rotate-90" />,
    value: "TbArrowBackUp",
  },
];

export const getLaneWidth = () => 70;
export const getCrosswalkWidth = () => 10;
export const getRoadWidth = (roadConfig) => {
  return (
    (roadConfig.lanesLeft.length + roadConfig.lanesRight.length) *
    getLaneWidth()
  );
};
export const getIntersectionSize = (config) => {
  // Helper function to calculate the full road width (lanes + sidewalks)
  const calculateRoadWidth = (roadConfig) => {
    if (!roadConfig.visible) return 0;
    const maxLanes = Math.max(
      roadConfig.lanesLeft.length,
      roadConfig.lanesRight.length
    );
    return maxLanes * getLaneWidth() + getCrosswalkWidth();
  };

  // Calculate maximum road width and height
  const maxWidth = Math.max(
    calculateRoadWidth(config.north),
    calculateRoadWidth(config.south)
  );
  const maxHeight = Math.max(
    calculateRoadWidth(config.east),
    calculateRoadWidth(config.west)
  );

  // Return the maximum size considering both width and height
  return Math.max(maxWidth, maxHeight);
};

// export const getMaxRoadWidth = (roadConfig) => {
//   return (
//     Math.max(getRoadWidth(roadConfig.east), getRoadWidth(roadConfig.west)) + 20
//   );
// };
