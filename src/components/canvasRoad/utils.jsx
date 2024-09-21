export const getLaneWidth = () => 40;

export const getRoadWidth = (roadConfig) => {
  return (roadConfig.lanesFrom + roadConfig.lanesTo) * getLaneWidth();
};

export const getIntersectionSize = (config) => {
  const getMaxRoadWidth = Math.max(
    config.north.visible ? getRoadWidth(config.north) : 0,
    config.south.visible ? getRoadWidth(config.south) : 0
  );

  return getMaxRoadWidth + config.sidewalkWidth * 2;
};

// export const getMaxRoadWidth = (roadConfig) => {
//   return (
//     Math.max(getRoadWidth(roadConfig.east), getRoadWidth(roadConfig.west)) + 20
//   );
// };
