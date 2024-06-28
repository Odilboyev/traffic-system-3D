import { Typography, CardBody, Card } from "@material-tailwind/react";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import baseLayers, { layerSave } from "../../../../../configurations/mapLayers";

const LightsOnMap = ({ center }) => {
  const zoom = localStorage.getItem("mapZoom");
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
      </MapContainer>
    </>
  );
};

export default LightsOnMap;
