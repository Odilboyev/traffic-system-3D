import { getRoadWidth } from "../utils";

const Road = ({
  maxRoadWidth,
  direction,
  config,
  renderCrosswalks,
  renderLanes,
}) => {
  const roadWidth = getRoadWidth(config[config]);

  const isVertical = direction === "vertical";

  const sizeStyle = {
    width: isVertical ? `${roadWidth}px` : `calc(50% - ${maxRoadWidth / 2}px)`,
    height: isVertical ? `calc(50% - ${maxRoadWidth / 2}px)` : `${roadWidth}px`,
  };

  const positionStyle = {
    top: config === "north" ? 0 : undefined,
    bottom: config === "south" ? 0 : undefined,
    left: config === "west" ? 0 : `calc(50% - ${roadWidth / 2}px)`,
    right: config === "east" ? 0 : undefined,
  };

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ ...sizeStyle, ...positionStyle }}
    >
      {renderLanes(direction, config)}
      {renderCrosswalks}
    </div>
  );
};
export default Road;
