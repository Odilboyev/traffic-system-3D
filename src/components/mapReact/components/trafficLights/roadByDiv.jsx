import { useState, useEffect } from "react";
import "./div.css";

const CrossroadByDiv = () => {
  const [lights, setLights] = useState({
    north: false,
    south: false,
    east: false,
    west: false,
  });

  const [lanes, setLanes] = useState({
    north: 4,
    south: 3,
    east: 4,
    west: 5,
  });

  useEffect(() => {
    // Simulate traffic light data change
    const interval = setInterval(() => {
      setLights((prev) => ({
        north: !prev.north,
        south: !prev.south,
        east: !prev.east,
        west: !prev.west,
      }));
    }, 3000);

    // Simulate lane data change
    const laneInterval = setInterval(() => {
      setLanes((prev) => ({
        north: Math.floor(Math.random() * 6) + 1,
        south: Math.floor(Math.random() * 6) + 1,
        east: Math.floor(Math.random() * 6) + 1,
        west: Math.floor(Math.random() * 6) + 1,
      }));
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(laneInterval);
    };
  }, []);

  const renderLanes = (direction) => {
    const lanesArray = Array.from({ length: lanes[direction] }, (_, i) => i);
    return lanesArray.map((lane) => (
      <div
        key={lane}
        className={`lane ${lights[direction] ? "green" : "red"}`}
      />
    ));
  };

  return (
    <div className="crossroad w-3/4">
      <div className="road horizontal top">{renderLanes("north")}</div>
      <div className="road vertical left">{renderLanes("west")}</div>
      <div className="center">
        <div className={`arrow ${lights.north ? "green" : "red"}`} />
        <div className={`arrow ${lights.east ? "green" : "red"}`} />
        <div className={`arrow ${lights.south ? "green" : "red"}`} />
        <div className={`arrow ${lights.west ? "green" : "red"}`} />
      </div>
      <div className="road vertical right">{renderLanes("east")}</div>
      <div className="road horizontal bottom">{renderLanes("south")}</div>
    </div>
  );
};

export default CrossroadByDiv;
