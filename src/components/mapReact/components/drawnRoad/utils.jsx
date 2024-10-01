import { TbArrowBackUp, TbArrowRampRight, TbArrowUp } from "react-icons/tb";

export const iconOptions = [
  { name: "Right Ramp", icon: <TbArrowRampRight />, value: "TbArrowRampRight" },
  { name: "Arrow Up", icon: <TbArrowUp />, value: "TbArrowUp" },
  {
    name: "Arrow Back Up",
    icon: <TbArrowBackUp className="-rotate-90" />,
    value: "TbArrowBackUp",
  },
];

export const getLaneWidth = () => 60;
export const getCrosswalkWidth = () => 20;
export const getRoadWidth = (roadConfig) => {
  return (
    (roadConfig.lanesLeft.length + roadConfig.lanesRight.length) *
    getLaneWidth()
  );
};
export const getIntersectionSize = (config) => {
  // Helper function to calculate the full road width (lanes + crosswalks)
  const calculateRoadWidth = (roadConfig) => {
    if (!roadConfig.visible) return 0;
    const maxLanes = Math.max(
      roadConfig.lanesLeft.length,
      roadConfig.lanesRight.length
    );
    return maxLanes * getLaneWidth() + getCrosswalkWidth();
  };

  // Calculate the road widths for all four directions
  const widthNorth = calculateRoadWidth(config.north);
  const widthSouth = calculateRoadWidth(config.south);
  const heightEast = calculateRoadWidth(config.east);
  const heightWest = calculateRoadWidth(config.west);

  // Use the maximum of both widths and heights to ensure the intersection fits properly
  const totalWidth = Math.max(widthNorth, widthSouth);
  const totalHeight = Math.max(heightEast, heightWest);

  // Return the larger value between width and height
  return Math.max(totalWidth, totalHeight);
};
