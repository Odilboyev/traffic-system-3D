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

export const getLaneWidth = () => 40;
export const getCrosswalkWidth = () => 20;
export const getRoadWidth = (roadConfig) => {
  return (
    (roadConfig.lanesLeft.length + roadConfig.lanesRight.length) *
    getLaneWidth()
  );
};
export const getIntersectionSize = (config) => {
  // Calculate the width needed for each direction
  const calculateRoadWidth = (roadConfig) => {
    if (!roadConfig.visible) return 0;
    const totalLanes =
      roadConfig.lanesLeft.length + roadConfig.lanesRight.length;
    return totalLanes * getLaneWidth();
  };

  // Get widths for all directions
  const northWidth = calculateRoadWidth(config.north);
  const southWidth = calculateRoadWidth(config.south);
  const eastWidth = calculateRoadWidth(config.east);
  const westWidth = calculateRoadWidth(config.west);

  // Use the maximum width between opposing directions
  const verticalWidth = Math.max(northWidth, southWidth);
  const horizontalWidth = Math.max(eastWidth, westWidth);

  // Base size should be enough to accommodate the wider of the two directions
  const baseSize = Math.max(verticalWidth, horizontalWidth);

  // Add just enough padding to ensure corners meet the roads
  // The tangent of 45° is 1, so we need ~1.4 (√2) to ensure corners reach
  const paddingFactor = 1.3;

  return Math.ceil(baseSize * paddingFactor);
};
