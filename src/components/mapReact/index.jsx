import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-rotatedmarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
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
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import getCookie from "../../tools/getCookie";
import { getBoxData, getMarkerData, markerHandler } from "../../apiHandlers";
import Legend from "./components/message";
import login from "../../Auth";
import { useNavigate } from "react-router-dom";
import SingleRecord from "./components/singleRecord";
import Box from "./components/box";
import MonitoringModal from "./components/monitoringModal";
import DeviceModal from "../deviceModal";
import { singleBox } from "../../mock/data";
const home = [41.2995, 69.2401];
const MapComponent = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [isbigMonitorOpen, setIsbigMonitorOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [activeBox, setActiveBox] = useState(singleBox);
  const [center] = useState(
    JSON.parse(localStorage.getItem("mapCenter"))
      ? JSON.parse(localStorage.getItem("mapCenter"))
      : home
  );
  const [zoom] = useState(
    localStorage.getItem("mapZoom") ? localStorage.getItem("mapZoom") : 13
  );
  const [markers, setMarkers] = useState([]);
  const [rotated, setrotated] = useState(0);
  const [isDraggable, setiIsDraggable] = useState(false);
  // const [types, setTypes] = useState(0);
  const [filter, setFilter] = useState({
    box: true,
    camera: true,
    crossroad: true,
  });
  const checkboxConfigurations = [
    { type: "all", label: "All" },
    { type: "box", label: "Box" },
    { type: "camera", label: "Cameras" },
    { type: "crossroad", label: "Crossroads" },
  ];

  const getDataHandler = async () => {
    setIsloading(true);
    try {
      setIsloading(false);
      const myData = await getMarkerData();
      console.log(myData);
      if (myData?.status == 0) {
        console.log(myData);
        localStorage.clear();
        login.logout();
        navigate("/", { replace: true });
        localStorage.setItem("data", JSON.stringify(myData));
        window.location.reload();
      } else {
        setMarkers(myData.data);
      }
    } catch (error) {
      setIsloading(false);

      throw new Error(error);
    }
  };
  useEffect(() => {
    // setInterval(() => {
    //   getDataHandler();
    // }, 1000);
    getDataHandler();
    return () => {
      setMarkers([]);
    };
  }, []);

  const handleFilterChange = (name, checked) => {
    console.log(name, checked);
    if (name === "all") {
      // If the "All" checkbox is clicked, update all filter options
      setFilter({
        box: checked,
        camera: checked,
        crossroad: checked,
      });
    } else {
      // If an individual filter option is clicked, update only that option
      setFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  // const [openedPopupMarkerId, setOpenedPopupMarkerId] = useState(null);

  const handleMarkerDragEnd = (id, type, event) => {
    const { lat, lng } = event.target.getLatLng();

    console.log(id, "dragEnd");
    console.log(lng);

    try {
      markerHandler({ lat: lat + "", lng: lng + "", id, type });
      // getData();
    } catch (error) {
      getData();
    }
  };
  const handlePopupOpen = (id) => {
    const marker = markers.find((marker) => marker.id === id);
    setrotated(marker.rotated);
    // setOpenedPopupMarkerId(id);
  };
  // const handleMarkerRotate = (currentMarker) => {
  //   setMarkers((prevMarkers) =>
  //     prevMarkers.map((marker) =>
  //       marker.id === currentMarker.id
  //         ? { ...marker, rotated: rotated }
  //         : marker
  //     )
  //   );
  // };
  const handleMonitorCrossroad = (marker) => {
    setActiveMarker(marker ? marker : null);
    setIsbigMonitorOpen(!isbigMonitorOpen);
  };
  const handleBoxModalOpen = async (box) => {
    if (box) {
      try {
        const res = await getBoxData(box.cid);
        setActiveBox(res);
      } catch (error) {
        throw new Error(error);
      }
      // setActiveBox(box ? box : null);
      setIsBoxModalOpen(!isBoxModalOpen);
    }
  };
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

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "#FFD700"; // Red
      case 2:
        return "#FF0000"; // Gold
      case 3:
        return "#FFC0CB"; // Teal
      default:
        return "#019191"; // Light Pink
    }
  };
  const markerHanler = (marker) => {
    console.log(marker);
    console.log(
      `https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`
    );
  };

  return (
    <MapContainer
      attributionControl={false}
      fullscreenControl={true}
      center={center}
      zoom={zoom}
      style={{ height: "100vh" }}
      whenCreated={setMap}
    >
      <MapEvents />
      <Legend map={map} />
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
        <LayersControl.BaseLayer name="2GIS">
          <TileLayer url="http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
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
            <div className="filter-panel p-2 flex flex-col bg-white me-2">
              {checkboxConfigurations.map(({ type, label }) => (
                <Checkbox
                  key={type}
                  label={<Typography color="blue-gray">{label}</Typography>}
                  ripple={false}
                  className="m-0 p-0"
                  checked={
                    type == "all"
                      ? filter.box && filter.camera && filter.crossroad
                      : filter[type]
                  }
                  onChange={(e) => handleFilterChange(type, e.target.checked)}
                />
              ))}
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
        iconCreateFunction={(cluster) => {
          const childMarkers = cluster.getAllChildMarkers();

          const statusCounts = {};

          childMarkers.forEach((marker) => {
            const status = marker.options.statuserror;
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });

          const pieChartData = Object.entries(statusCounts).map(
            ([status, count]) => ({
              status: parseInt(status),
              count,
            })
          );

          const totalMarkers = childMarkers.length;

          const pieChartIcon = L.divIcon({
            className: "cluster",
            iconSize: L.point(40, 40),
            html: renderToString(
              <div className="w-16 h-16">
                <PieChart
                  data={pieChartData.map((datam) => ({
                    value: datam.count,
                    title: datam.status,
                    color: getStatusColor(datam.status),
                  }))}
                  style={{ filter: `drop-shadow(0 0 0.75rem #0101018d)` }}
                  radius={42}
                  labelStyle={{
                    fill: "#fff",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                  label={(props) => {
                    return props.dataEntry.value;
                  }}
                  // labelPosition={30}
                />
              </div>
            ),
            //           html: `<div class="pie-chart" style="width: 40px; height: 40px;" style="background-image: conic-gradient()">
            //   ${pieChartData
            //     .map((data) => {
            //       const statusColor = getStatusColor(data.status);
            //       const percentage = (data.count / totalMarkers) * 100;
            //       const rotationAngle = getRotationAngle(percentage);
            //       return `<div class="slice ${statusColor} w-[${percentage}%] h-[40px]" ><div class="label">${data.count}</div></div>
            //               `;
            //     })
            //     .join("")}
            // </div>`,
          });

          return pieChartIcon;
        }}
      >
        {markers?.map((marker, i) => {
          if (
            (marker.type === 1 && !filter.camera) ||
            (marker.type === 2 && !filter.crossroad) ||
            (marker.type === 3 && !filter.box)
          ) {
            return null;
          }

          // Skip mapping the marker if lat or lng is undefined
          if (isNaN(Number(marker.lat)) || isNaN(Number(marker.lng))) {
            return null;
          }

          return (
            <Marker
              key={i}
              position={[marker.lat, marker.lng]}
              draggable={isDraggable}
              rotationAngle={marker.rotated}
              eventHandlers={{
                click:
                  marker.type == 2
                    ? () => handleMonitorCrossroad(marker)
                    : marker.type == 3
                    ? () => handleBoxModalOpen(marker)
                    : () => markerHanler(marker),
                dragend: (event) =>
                  handleMarkerDragEnd(marker.cid, marker.type, event),
                popupopen: () => handlePopupOpen(marker.id),
              }}
              statuserror={marker.statuserror}
              icon={L.icon({
                iconUrl: `icons/${marker.icon}`,
                iconSize: [32, 32],
              })}
              markerType={marker.type}
              rotatedAngle={marker.type === 3 ? marker.rotated : 0}
            >
              {marker.type !== 2 && marker.type !== 3 && (
                <Popup
                  interactive
                  minWidth={"600px"}
                  closeOnClick={false}
                  autoClose={false}
                  className="p-0"
                  eventHandlers={{
                    mouseover: (e) => {
                      const element = e.target.getElement();
                      const draggable = new L.Draggable(element);
                      draggable.enable();
                    },
                  }}
                >
                  {marker.type === 1 ? (
                    <SingleRecord {...marker} />
                  ) : (
                    <div>default</div>
                  )}
                </Popup>
              )}
              {marker.type == 1 && (
                <Tooltip direction="top">
                  <div className="w-[30vw]">
                    <img
                      src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
                      className="w-full"
                      alt=""
                    />
                  </div>
                </Tooltip>
              )}
            </Marker>
          );
        })}{" "}
        <MonitoringModal
          marker={activeMarker}
          open={isbigMonitorOpen}
          handleOpen={() => setIsbigMonitorOpen(false)}
        />
        <DeviceModal
          device={activeBox}
          isDialogOpen={isBoxModalOpen}
          handler={() => setIsBoxModalOpen(false)}
          isLoading={isLoading}
        />
      </MarkerClusterGroup>{" "}
    </MapContainer>
  );
};

export default MapComponent;
