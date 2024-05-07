import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "@kalisio/leaflet.donutcluster/src/Leaflet.DonutCluster";
import L from "leaflet";
import "leaflet-rotatedmarker";
import zebraIcon from "@/assets/zebra.png";
import cameraIcon from "@/assets/camera.png";
import crossRoadIcon from "@/assets/crossroad.png";
import mockdata from "../map/mock";

import {
  Button,
  Checkbox,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Switch,
  Typography,
} from "@material-tailwind/react";
import Control from "react-leaflet-custom-control";
import { Cog8ToothIcon, ListBulletIcon } from "@heroicons/react/16/solid";
import "./styles.css";
const MapComponent = () => {
  const [center, setCenter] = useState(
    JSON.parse(localStorage.getItem("mapCenter"))
      ? JSON.parse(localStorage.getItem("mapCenter"))
      : [51.505, -0.09]
  );
  const [zoom, setZoom] = useState(
    localStorage.getItem("mapZoom") ? localStorage.getItem("mapZoom") : 13
  );
  const [markers, setMarkers] = useState(mockdata);
  const [rotated, setrotated] = useState(0);
  const [isDraggable, setiIsDraggable] = useState(false);
  // const [types, setTypes] = useState(0);
  const [filter, setFilter] = useState({
    crosswalk: true,
    camera: true,
    crossroad: true,
  });
  const handleFilterChange = (name, checked) => {
    console.log(name, checked);
    if (name === "all") {
      // If the "All" checkbox is clicked, update all filter options
      setFilter({
        crosswalk: checked,
        camera: checked,
        crossroad: checked,
      });
    } else {
      // If an individual filter option is clicked, update only that option
      setFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  // const [openedPopupMarkerId, setOpenedPopupMarkerId] = useState(null);

  useEffect(() => {
    setMarkers(mockdata);
  }, []);

  const handleMarkerDragEnd = (id, event) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, lat, lng } : marker
      )
    );
  };
  const handlePopupOpen = (id) => {
    const marker = markers.find((marker) => marker.id === id);
    setrotated(marker.rotated);
    // setOpenedPopupMarkerId(id);
  };
  const handleMarkerRotate = (currentMarker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === currentMarker.id
          ? { ...marker, rotated: rotated }
          : marker
      )
    );
  };
  useEffect(() => {
    console.log(markers);
  }, [markers]);

  const handleMapMove = (event) => {
    // Save center and zoom values to localStorage
    const newCenter = event.target.getCenter();
    const newZoom = event.target.getZoom();

    localStorage.setItem("mapCenter", JSON.stringify(newCenter));
    localStorage.setItem("mapZoom", newZoom);
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: handleMapMove,
    });

    return null;
  };

  return (
    <MapContainer
      attributionControl={false}
      center={center}
      zoom={zoom}
      style={{ height: "100vh" }}
    >
      <MapEvents />
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name="OpenStreetMap" checked>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="OpenStreetMap"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Transport">
          <TileLayer
            url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714"
            attribution="Transport"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Transport Dark">
          <TileLayer
            url="https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714"
            attribution="Transport Dark"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <Control position="top">
        <SpeedDial placement="right">
          <SpeedDialHandler className="shadow shadow-gray-600 rounded bg-white w-10 h-10 cursor-pointer">
            {/* <IconButton ripple={false} color="red"> */}
            <ListBulletIcon className="w-5 h-5 p-2" />
            {/* </IconButton> */}
          </SpeedDialHandler>
          {/* color="blue" onClick={() => console.log("Filter button clicked")} */}
          <SpeedDialContent>
            {" "}
            <div className="filter-panel p-2 flex flex-col  bg-white me-2">
              <Checkbox
                label={<Typography color="blue-gray">All</Typography>}
                ripple={false}
                className="m-0 p-0"
                checked={filter.crosswalk && filter.camera && filter.crossroad}
                onChange={(e) => handleFilterChange("all", e.target.checked)}
              />
              <Checkbox
                label={<Typography color="blue-gray">Corsswalks</Typography>}
                ripple={false}
                className="m-0 p-0"
                checked={filter.crosswalk}
                onChange={(e) =>
                  handleFilterChange("crosswalk", e.target.checked)
                }
              />
              <Checkbox
                label={<Typography color="blue-gray">Cameras</Typography>}
                ripple={false}
                className="m-0 p-0"
                checked={filter.camera}
                onChange={(e) => handleFilterChange("camera", e.target.checked)}
              />
              <Checkbox
                label={<Typography color="blue-gray">Crossroads</Typography>}
                ripple={false}
                className="m-0 p-0"
                checked={filter.crossroad}
                onChange={(e) =>
                  handleFilterChange("crossroad", e.target.checked)
                }
              />
              {/* <div>
                <label>
                  <input
                    type="checkbox"
                    name="crosswalk"
                    checked={filter.crosswalk}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  Type 1
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="camera"
                    checked={filter.camera}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  Type 2
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="crossroad"
                    checked={filter.crossroad}
                    onChange={(e) => handleFilterChange(e)}
                  />
                  Type 3
                </label>
              </div> */}
            </div>
          </SpeedDialContent>
        </SpeedDial>
      </Control>
      <Control position="top">
        <SpeedDial placement="bottom">
          <SpeedDialHandler className="shadow shadow-gray-600 rounded bg-white w-10 h-10 cursor-pointer">
            {/* <IconButton ripple={false} color="red"> */}
            <Cog8ToothIcon className="w-5 h-5 p-2" />

            {/* </IconButton> */}
          </SpeedDialHandler>
          {/* color="blue" onClick={() => console.log("Filter button clicked")} */}
          <SpeedDialContent>
            <div className="bg-white p-4 rounded flex flex-col justify-center items-center ">
              {" "}
              <Typography className="mb-2 select-none">
                {isDraggable ? "Editable" : "Not Editable"}
              </Typography>
              <Switch
                size={"sm"}
                checked={isDraggable}
                onChange={(e) => setiIsDraggable(e.target.checked)}
              />
            </div>
          </SpeedDialContent>
        </SpeedDial>
      </Control>
      <MarkerClusterGroup
        spiderfyOnMaxZoom={false}
        showCoverageOnHover={false}
        disableClusteringAtZoom={15}
        chunkedLoading={true}
        chunkInterval={200}
        zoomToBoundsOnClick={true}
        animate={true}
        animateAddingMarkers={false}
        spiderLegPolylineOptions={{
          weight: 0,
          opacity: 0,
        }}
      >
        {markers?.map((marker, i) => {
          if (
            (marker.type == 1 && !filter.crosswalk) ||
            (marker.type == 2 && !filter.camera) ||
            (marker.type == 3 && !filter.crossroad)
          ) {
            return null;
          }
          return (
            <Marker
              key={i}
              position={[marker.lat, marker.lng]}
              draggable={isDraggable}
              rotationAngle={marker.rotated}
              eventHandlers={{
                dragend: (event) => handleMarkerDragEnd(marker.id, event),
                popupopen: () => handlePopupOpen(marker.id),
              }}
              icon={
                marker.type === 1
                  ? L.icon({
                      iconUrl: zebraIcon,
                      iconSize: [32, 32],
                    })
                  : marker.type === 2
                  ? L.icon({
                      iconUrl: cameraIcon,
                      iconSize: [32, 32],
                    })
                  : L.icon({
                      iconUrl: crossRoadIcon,
                      iconSize: [32, 32],
                    })
              }
              rotatedAngle={marker.type === 3 ? marker.rotated : 0}
            >
              <Popup className="p-0">
                <div>
                  <h3>
                    {marker.type === 1
                      ? "Zebra"
                      : marker.type === 2
                      ? "Camera"
                      : "Crossroad"}
                    <span className="ml-2"> {marker.id}</span>
                  </h3>
                  {/* <p>Latitude: {marker.lat}</p>
              <p>Longitude: {marker.lng}</p> */}
                  {marker.type === 1 && (
                    <div>
                      <div className="w-10 border p-1">
                        <img
                          src={
                            marker.type == 1
                              ? zebraIcon
                              : marker.type == 2
                              ? cameraIcon
                              : crossRoadIcon
                          }
                          alt="Marker"
                          style={{
                            transform: `rotate(${rotated}deg)`,
                          }}
                        />
                      </div>
                      <div className="flex justify-center items-center w-full p-0">
                        {" "}
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={rotated}
                          onChange={(event) =>
                            setrotated(Number(event.target.value))
                          }
                        />
                        <Button
                          size={"sm"}
                          variant="outlined"
                          className="rounded-lg py-0 px-3 ml-0.5"
                          onClick={() => handleMarkerRotate(marker)}
                        >
                          {rotated}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
