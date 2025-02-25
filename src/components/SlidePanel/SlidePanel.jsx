import "./SlidePanel.css";

import PropTypes from "prop-types";
import React from "react";

const SlidePanel = ({ side = "right", content, isOpen, onHandleOpen }) => {
  const positionStyles = {
    top: { top: isOpen ? "0" : "-100%", left: 0, right: 0 },
    bottom: { bottom: isOpen ? "0" : "-100%", left: 0, right: 0 },
    left: { left: isOpen ? "0" : "-100%", top: "64px", bottom: 0 },
    right: { right: isOpen ? "0" : "-100%", top: "64px", bottom: 0 },
  };

  const isVertical = side === "top" || side === "bottom";

  return (
    <div
      className={`slide-panel slide-panel-${side} scrollbar-hide`}
      style={{
        ...positionStyles[side],
        width: isVertical ? "100%" : "auto",
        height: isVertical ? "auto" : "calc(100vh - 64px)",
      }}
    >
      <div className="slide-panel-content">{content}</div>
      {/* <button
        className={`slide-panel-close slide-panel-close-${side}`}
        onClick={() => onHandleOpen(false)}
        aria-label="Close panel"
      >
        ×
      </button> */}
    </div>
  );
};

SlidePanel.propTypes = {
  side: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onHandleOpen: PropTypes.func.isRequired,
};

export default SlidePanel;
