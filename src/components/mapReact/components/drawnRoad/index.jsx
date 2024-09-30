import { useEffect, useState } from "react";
import ConfigPanel from "./components/configPanel";
import Intersection from "./components/intersection";
import useLocalStorageState from "../../../../customHooks/uselocalStorageState";
const RoadDrawing = () => {
  const [config, setConfig] = useLocalStorageState("its_roadDrawingConfig", {
    angle: 45,
    north: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowRampRight" },
      ],
      visible: true,
      direction: "vertical",
    },
    south: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowRampRight" },
      ],
      visible: true,
      direction: "vertical",
    },
    east: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowRampRight" },
      ],
      visible: true,
      direction: "horizontal",
    },
    west: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowUp" },
        { icon: "TbArrowRampRight" },
      ],
      visible: true,
      direction: "horizontal",
    },
  });

  const [trafficLights, setTrafficLights] = useState({
    north: "red",
    south: "red",
    east: "green",
    west: "green",
  });

  const [crosswalks, setCrosswalks] = useState({
    north: "green",
    south: "green",
    east: "red",
    west: "red",
  });
  useEffect(() => {
    console.log("config ", config);
  }, [config]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLights((prev) => ({
        north: prev.north === "red" ? "green" : "red",
        south: prev.south === "red" ? "green" : "red",
        east: prev.east === "red" ? "green" : "red",
        west: prev.west === "red" ? "green" : "red",
      }));

      setCrosswalks((prev) => ({
        north: prev.north === "green" ? "red" : "green",
        south: prev.south === "green" ? "red" : "green",
        east: prev.east === "red" ? "green" : "red",
        west: prev.west === "red" ? "green" : "red",
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <ConfigPanel config={config} setConfig={setConfig} />
      <Intersection
        config={config}
        trafficLights={trafficLights}
        crosswalks={crosswalks}
      />
    </div>
  );
};

export default RoadDrawing;
