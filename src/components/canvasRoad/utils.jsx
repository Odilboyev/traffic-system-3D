export const getLaneWidth = () => 40;

export const getRoadWidth = (roadConfig) => {
  return (roadConfig.lanesFrom + roadConfig.lanesTo) * getLaneWidth();
};
export const getIntersectionSize = (config) => {
  // Calculate maximum road width (lanesFrom or lanesTo, whichever is larger) plus sidewalks
  const maxWidth = Math.max(
    config.north.visible
      ? Math.max(config.north.lanesFrom, config.north.lanesTo) *
          getLaneWidth() +
          config.sidewalkWidth * 2
      : 0,
    config.south.visible
      ? Math.max(config.south.lanesFrom, config.south.lanesTo) *
          getLaneWidth() +
          config.sidewalkWidth * 2
      : 0
  );
  // Calculate maximum road height (lanesFrom or lanesTo, whichever is larger) plus sidewalks
  const maxHeight = Math.max(
    config.east.visible
      ? Math.max(config.east.lanesFrom, config.east.lanesTo) * getLaneWidth() +
          config.sidewalkWidth * 2
      : 0,
    config.west.visible
      ? Math.max(config.west.lanesFrom, config.west.lanesTo) * getLaneWidth() +
          config.sidewalkWidth * 2
      : 0
  );
  return Math.max(maxWidth, maxHeight);
};
// export const getMaxRoadWidth = (roadConfig) => {
//   return (
//     Math.max(getRoadWidth(roadConfig.east), getRoadWidth(roadConfig.west)) + 20
//   );
// };
