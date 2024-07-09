import { Typography, CardBody, Card } from "@material-tailwind/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import baseLayers, { layerSave } from "../../../../../configurations/mapLayers";
import rightIcon from "../../../../../assets/icons/right.png";
import leftIcon from "../../../../../assets/icons/left.png";
const LightsOnMap = ({ center, lights = [], lightsSocketData = [] }) => {
  const zoom = localStorage.getItem("mapZoom");
  const lightsToRender = lightsSocketData ? lightsSocketData : lights;
  console.log(lightsToRender, "lightsonmap");
  // const currentState = lights?.map((v) => {
  //   return {
  //     ...v,
  //     status: lightsSocketData?.find((light) => light.id === v.id)?.status,
  //     countdown: lightsSocketData?.find((light) => light.id === v.id)
  //       ?.countdown,
  //   };
  // });
  return (
    <>
      <MapContainer
        attributionControl={false}
        center={center}
        zoom={zoom || 13}
        maxZoom={18}
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
              />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>
        {lightsToRender?.map((v, i) => (
          <Marker
            key={i}
            position={[v.lat, v.lng]}
            icon={L.divIcon({
              className: "custom-marker-icon",
              html: `
            <div class="flex items-center w-[50px] p-1 max-h-20 rounded-lg ${
              v.status === 1
                ? "bg-green-400"
                : v.status === 2
                ? "bg-red-400"
                : "bg-yellow-400"
            }">
            <div class="max-w-[47%] rounded-lg"> <img src="icons/${
              v.status === 1
                ? "svetofor0.png"
                : v.status === 2
                ? "svetofor2.png"
                : "svetofor1.png"
            }" style="width:100%"/></div>
            <span class="font-bold mx-1 text-white">${v.countdown}</span>
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

export default LightsOnMap;
