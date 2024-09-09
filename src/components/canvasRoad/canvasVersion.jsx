// TrafficIntersection.js
import React, { useState } from "react";
import classNames from "classnames";

const Road = ({ lanes, isVertical }) => (
  <div
    className={classNames("relative", {
      "w-1/2": isVertical,
      "h-1/2": !isVertical,
    })}
  >
    {Array.from({ length: lanes }).map((_, index) => (
      <div
        key={index}
        className={classNames("absolute", {
          "w-full h-1/4": isVertical,
          "h-full w-1/4": !isVertical,
          "bg-gray-400": true,
          "top-0 left-0": index === 0,
          "top-1/4 left-0": index === 1,
          "top-1/2 left-0": index === 2,
          "top-3/4 left-0": index === 3,
        })}
      />
    ))}
  </div>
);

const Crosswalk = () => (
  <div className="absolute border-2 border-black w-full h-8 bg-gray-200">
    {/* Crosswalk stripes */}
  </div>
);

const TrafficLight = ({ active }) => (
  <div className="w-10 h-20 bg-gray-800 text-white flex flex-col items-center justify-around">
    <div
      className={classNames("w-8 h-8 rounded-full", {
        "bg-red-500": active === "red",
        "bg-gray-600": active !== "red",
      })}
    />
    <div
      className={classNames("w-8 h-8 rounded-full", {
        "bg-yellow-500": active === "yellow",
        "bg-gray-600": active !== "yellow",
      })}
    />
    <div
      className={classNames("w-8 h-8 rounded-full", {
        "bg-green-500": active === "green",
        "bg-gray-600": active !== "green",
      })}
    />
  </div>
);

const TrafficIntersection = ({
  roads = {
    vertical: [2, 3], // Number of lanes in each vertical road
    horizontal: [2, 3], // Number of lanes in each horizontal road
  },
}) => {
  const [activeLight, setActiveLight] = useState("green");

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
        {/* Vertical Roads */}
        {roads.vertical.map((lanes, index) => (
          <Road key={index} lanes={lanes} isVertical />
        ))}

        {/* Horizontal Roads */}
        {roads.horizontal.map((lanes, index) => (
          <Road key={index} lanes={lanes} />
        ))}

        {/* Crosswalks */}
        <Crosswalk />

        {/* Traffic Lights */}
        <div className="absolute top-1/2 left-1/2">
          <TrafficLight active={activeLight} />
        </div>
      </div>
    </div>
  );
};

export default TrafficIntersection;
