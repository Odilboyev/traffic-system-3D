import React from "react";

const ThreeArrowsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="40px"
    height="40px"
    style={{ transform: "rotate(-90deg)" }}
  >
    {/* Right arrow with tail */}
    <path d="M22 12L18 8V11H2V13H18V16L22 12Z" />

    {/* Top arrow with tail */}
    <path d="M12 2L8 6H11V14H13V6H16L12 2Z" />

    {/* Bottom arrow with tail */}
    <path d="M12 22L16 18H13V14H11V18H8L12 22Z" />

    {/* Center connector */}
    <path d="M11 13H13V15H11V13Z" />
  </svg>
);

export default ThreeArrowsIcon;
