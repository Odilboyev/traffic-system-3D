import {
  Typography,
  CardBody,
  Card,
  Slider,
  SpeedDial,
  IconButton,
  SpeedDialHandler,
  SpeedDialContent,
  useTheme,
  Radio,
} from "@material-tailwind/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { memo, useEffect, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { renderToString } from "react-dom/server";
import { TbArrowRampLeft, TbArrowRampRight } from "react-icons/tb";
import { MdStraight } from "react-icons/md";
import { IoIosWalk, IoMdMan } from "react-icons/io";
import baseLayers, { layerSave } from "../../../../configurations/mapLayers";
import "leaflet-rotatedmarker";
import Control from "react-leaflet-custom-control";
import { MapIcon } from "@heroicons/react/16/solid";
import ZoomControl from "../CustomZoomControl";
const TrafficLights = ({ center, lights = [], lightsSocketData = [] }) => {
  const zoom = localStorage.getItem("mapZoom");
  const lightsToRender = lightsSocketData ? lightsSocketData : lights || [];
  console.log(lightsToRender, "lightsonmap");
  // const [rotated, setrotated] = useState(0);
  // const handleRotate = (id) => {
  //   const marker = lightsToRender.find((marker) => marker.link_id === id);
  //   setrotated(marker.rotated);
  //   // setOpenedPopupMarkerId(id);
  // };
  const [selectedLayer, setSelectedLayer] = useState(
    localStorage.getItem("selectedLayer") || baseLayers[0].name
  );
  const { theme } = useTheme();
  const filteredLayers =
    theme === "dark"
      ? baseLayers.filter((layer) => layer.name.includes("Dark"))
      : baseLayers.filter((layer) => !layer.name.includes("Dark"));

  const currentLayer = baseLayers.find((layer) => layer.name === selectedLayer);
  const handleLayerChange = (layerName) => {
    setSelectedLayer(layerName);
    layerSave("selectedLayer", layerName);
  };

  useEffect(() => {
    if (theme === "dark") {
      handleLayerChange("Dark");
    } else handleLayerChange("2GIS");
  }, [theme]);
  // const currentState = lights?.map((v) => {
  //   return {
  //     ...v,
  //     status: lightsSocketData?.find((light) => light.id === v.id)?.status,
  //     countdown: lightsSocketData?.find((light) => light.id === v.id)
  //       ?.countdown,
  //   };
  // });
  const iconSelector = (type, status) => {
    switch (type) {
      case 1:
        return <MdStraight />;
      case 2:
        return status === 1 ? <IoIosWalk /> : <IoMdMan />;

      default:
        break;
    }
  };
  return (
    <>
      <MapContainer
        attributionControl={false}
        center={center}
        zoom={18}
        zoomControl={false}
        zoomDelta={0.5}
        zoomSnap={0}
        maxZoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        {currentLayer && (
          <TileLayer
            url={currentLayer.url}
            attribution={currentLayer.attribution}
          />
        )}
        <ZoomControl size={"md"} />
        <Control position="topleft">
          <SpeedDial placement="left">
            <IconButton
              // color={theme === "light" ? "black" : "white"}
              size="md"
            >
              <SpeedDialHandler className="w-10 h-10 cursor-pointer">
                <MapIcon className="w-6 h-6 p-2" />
              </SpeedDialHandler>
            </IconButton>
            <SpeedDialContent className="m-4">
              <div className="flex flex-col p-3 mb-10 rounded-md dark:bg-gray-900/80  bg-white/80 backdrop-blur-md">
                {filteredLayers.map((layer, i) => (
                  <Radio
                    key={i}
                    checked={selectedLayer === layer.name}
                    className="checked:bg-white"
                    variant={
                      selectedLayer === layer.name ? "filled" : "outlined"
                    }
                    onChange={() => handleLayerChange(layer.name)}
                    label={
                      <Typography className="mr-3 text-white">
                        {layer.name}
                      </Typography>
                    }
                  />
                ))}
              </div>
            </SpeedDialContent>
          </SpeedDial>
        </Control>
        {lightsToRender.length > 0 &&
          lightsToRender?.map((v, i) => (
            <Marker
              key={i}
              eventHandlers={{ popupopen: () => handleRotate(v.link_id) }}
              position={[v.lat, v.lng]}
              icon={L.divIcon({
                className: "custom-marker-icon",
                html: `
            <div class="flex items-center justify-center w-[50px] p-1 max-h-20 rounded-lg ${
              v.status === 1
                ? "bg-green-400"
                : v.status === 2
                ? "bg-red-400"
                : "bg-yellow-400"
            }">
            <div class="text-xl rounded-lg text-white font-bolder"> ${renderToString(
              <div style={{ transform: `rotate(${v.rotate}deg)` }}>
                {iconSelector(v.type, v.status)}
              </div>
            )}</div>
            <span class="font-bold mx-1 text-white">${v.countdown || 0}</span>
            </div>
          `,
              })}
            >
              <Popup className="p-4 text-blue-gray-900">
                <input type="range" max={360} />
                <div className="flex items-center justify-center w-full p-1 max-h-20 rounded-lg">
                  <div className="text-xl rounded-lg font-bolder mr-2">
                    <div style={{ transform: `rotate(${v.rotate}deg)` }}>
                      {iconSelector(v.type, v.status)}
                    </div>
                  </div>
                  <span className="font-bold mx-1 ">{v.rotate} Deg</span>
                </div>
              </Popup>
            </Marker>
          ))}
        {/* <Marker
          position={center}
          icon={L.divIcon({
            className: "custom-marker-icon",
            html: `
            <div class="flex items-center w-[50px] p-1 max-h-20 rounded-lg bg-green-400">
            <div class="max-w-[47%] rounded-lg"> <img src=${rightIcon} style="width:100%"/></div>
            <span class="font-bold mx-1 text-white">60</span>
            </div>
          `,
          })}
        ></Marker>
        <Marker
          position={center?.map((v) => Number(v) + 0.0002)}
          icon={L.divIcon({
            className: "custom-marker-icon",
            html: `
            <div class="flex items-center w-[50px] p-1 max-h-20 rounded-lg bg-red-400">
            <div class="max-w-[47%] rounded-lg"> <img src=${leftIcon} style="width:100%"/></div>
            <span class="font-bold mx-1 text-white">60</span>
            </div>
          `,
          })}
        ></Marker> */}
      </MapContainer>
    </>
  );
};

export default memo(TrafficLights);
