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
        { icon: "TbArrowBackUp", chanel_id: 3 },
        { icon: "TbArrowUp", chanel_id: 3 },
        { icon: "TbArrowUp", chanel_id: 3 },
        { icon: "TbArrowRampRight", chanel_id: 3 },
      ],
      visible: true,
      direction: "vertical",
      cross_walk: { chanel_id: 15 },
    },
    south: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp", chanel_id: 4 },
        { icon: "TbArrowUp", chanel_id: 4 },
        { icon: "TbArrowRight", chanel_id: 6 },
      ],
      visible: true,
      direction: "vertical",
      cross_walk: { chanel_id: 16 },
    },
    east: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp", chanel_id: 7 },
        { icon: "TbArrowUp", chanel_id: 7 },
        { icon: "TbArrowRampRight", chanel_id: 8 },
      ],
      visible: true,
      direction: "horizontal",
      cross_walk: { chanel_id: 17 },
    },
    west: {
      lanesLeft: [{}, {}],
      lanesRight: [
        { icon: "TbArrowBackUp", chanel_id: 9 },
        { icon: "TbArrowUp", chanel_id: 9 },
        { icon: "TbArrowUp", chanel_id: 9 },
        { icon: "TbArrowRampRight", chanel_id: 10 },
      ],
      visible: true,
      direction: "horizontal",
      cross_walk: { chanel_id: 18 },
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
