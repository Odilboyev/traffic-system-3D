import { Typography, CardBody, Card } from "@material-tailwind/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { memo, useEffect, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import { renderToString } from "react-dom/server";
import { TbArrowRampLeft, TbArrowRampRight } from "react-icons/tb";
import { MdStraight } from "react-icons/md";
import { IoIosWalk, IoMdMan } from "react-icons/io";
import baseLayers, { layerSave } from "../../../../configurations/mapLayers";

const TrafficLights = ({ center, lights = [], lightsSocketData = [] }) => {
  const zoom = localStorage.getItem("mapZoom");
  // const center = localStorage.getItem("mapCenter");
  const lightsToRender = lightsSocketData ? lightsSocketData : lights || [];
  console.log(lightsToRender, "lightsonmap");
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
        zoom={19}
        zoomDelta={0.5}
        zoomSnap={0}
        maxZoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        {" "}
        <LayersControl position="bottomleft">
          {baseLayers.map((layer) => (
            <LayersControl.BaseLayer
              key={layer.name}
              name={layer.name}
              checked={
                localStorage.getItem("selectedLayer")
                  ? localStorage.getItem("selectedLayer") == layer.name
                  : layer.checked
              }
            >
              <TileLayer
                name={layer.name}
                url={layer.url}
                eventHandlers={{ add: (e) => layerSave(e) }}
                attribution={layer.attribution}
                maxNativeZoom={18}
                maxZoom={22}
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
        {lightsToRender.length > 0 &&
          lightsToRender?.map((v, i) => (
            <Marker
              key={i}
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
            ></Marker>
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
