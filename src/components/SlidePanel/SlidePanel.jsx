import "./SlidePanel.css";

import React, { useEffect, useRef } from "react";

import PropTypes from "prop-types";

const SlidePanel = ({
  side = "right",
  content,
  isOpen,
  positionGap = {},
  onHandleOpen,
}) => {
  const positionStyles = {
    top: {
      top: isOpen ? "0" : "-100%",
      left: "50%",
      transform: "translateX(-50%)",
      margin: "0 auto",
      width: "fit-content",
      // maxWidth: "90vw",
    },
    bottom: {
      bottom: isOpen ? "16px" : "-100%",
      left: "50%",
      transform: "translateX(-50%)",
      margin: "0 auto",
      width: "fit-content",
    },
    left: {
      left: isOpen ? "16px" : "-100%",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      right: isOpen ? "16px" : "-100%",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  const isVertical = side === "top" || side === "bottom";

  return (
    <div
      className={`slide-panel  slide-panel-${side} scrollbar-hide`}
      style={{
        ...positionStyles[side],
        width: isVertical ? "100%" : "auto",
        height: "fit-content",
        [positionGap.from]: positionGap.value,
      }}
    >
      <div className="slide-panel-content">{content}</div>
    </div>
  );
};

SlidePanel.propTypes = {
  side: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  content: PropTypes.node,
  isOpen: PropTypes.bool,
  onHandleOpen: PropTypes.func,
  positionGap: PropTypes.shape({
    from: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default SlidePanel;
