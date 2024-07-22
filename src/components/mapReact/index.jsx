import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-rotatedmarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  Badge,
  Checkbox,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Switch,
  Typography,
} from "@material-tailwind/react";
import Control from "react-leaflet-custom-control";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog8ToothIcon,
  ListBulletIcon,
} from "@heroicons/react/16/solid";
import "./styles.css";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import { getBoxData, getMarkerData, markerHandler } from "../../apiHandlers";
import login from "../../Auth";
import { useNavigate } from "react-router-dom";
import MonitoringModal from "./components/crossroad";
import DeviceModal from "./components/box/deviceModal";
import CustomPopUp from "./components/customPopup";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/solid";
import baseLayers, { layerSave } from "../../configurations/mapLayers";
import TrafficLightsModal from "./components/trafficLights/modal";

const home = [41.2995, 69.2401];

const handleMapMove = (event) => {
  // Save center and zoom values to localStorage
  const newCenter = event.target.getCenter();
  const newZoom = event.target.getZoom();

  localStorage.setItem("mapCenter", JSON.stringify(newCenter));
  localStorage.setItem("mapZoom", newZoom);
};

const MapComponent = ({
  isSidebarOpen,
  handleSidebar,
  alarmCount,
  changedMarker,
}) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [isSidebarOpen, map]);

  const navigate = useNavigate();
  const layersRef = useRef(localStorage.getItem("selectedLayer"));
  const [isLoading, setIsloading] = useState(false);
  const [isbigMonitorOpen, setIsbigMonitorOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [clusterMarkers, setClusterMarkers] = useState([]);

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [activeBox, setActiveBox] = useState(null);

  const [isLightsModalOpen, setIsLightsModalOpen] = useState(false);
  const [isLightsLoading, setIsLightsLoading] = useState(false);
  const [activeLight, setActiveLight] = useState(26);

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
    trafficlights: true,
  });
  const checkboxConfigurations = [
    { type: "all", label: "All" },
    { type: "box", label: "Box" },
    { type: "camera", label: "Cameras" },
    { type: "crossroad", label: "Crossroads" },
    { type: "trafficlights", label: "Traffic Lights" },
  ];

  const getDataHandler = async () => {
    setIsloading(true);
    try {
      setIsloading(false);
      const myData = await getMarkerData();
      if (myData?.status == 999) {
        localStorage.clear();
        login.logout();
        navigate("/", { replace: true });
        localStorage.setItem("data", JSON.stringify(myData));
        window.location.reload();
      } else {
        setMarkers(
          myData.data.map((marker) => ({
            ...marker,
            isPopupOpen: false,
          }))
        );
      }
    } catch (error) {
      setIsloading(false);

      throw new Error(error);
    }
  };
  useEffect(() => {
    getDataHandler();
    return () => {
      setMarkers([]);
    };
  }, []);
  useEffect(() => {
    console.log(markers, "markers changed");

    return () => {};
  }, [markers]);
  const handleMarkerDragEnd = (id, type, event) => {
    const { lat, lng } = event.target.getLatLng();

    try {
      markerHandler({ lat: lat + "", lng: lng + "", id, type });
      // getData();
    } catch (error) {
      getDataHandler();
    }
  };
  // const onMarkerChange = (changedMarker) => {
  //   const updatedMarkers = markers.map((m) => {
  //     if (m.id === changedMarker.cid && m.type === changedMarker.type) {
  //       return changedMarker;
  //     }
  //     return m;
  //   });

  // };
  // useEffect(() => {
  //   onMarkerChange(changedMarker);
  //   return () => {};
  // }, [changedMarker]);
  const [markerUpdate, setMarkerUpdate] = useState(0);
  const clusterRef = useRef(null);
  // const [clusterGroup, setClusterGroup] = useState(null);

  // useEffect(() => {
  //   if (clusterRef.current) {
  //     setClusterGroup(clusterRef.current.leafletElement);
  //   }
  // }, [clusterRef.current]);

  const updateMarker = (updatedMarker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((m) => {
        if (m.cid === updatedMarker.cid && m.type === updatedMarker.type) {
          return updatedMarker;
        }
        return m;
      })
    );
    setMarkerUpdate(markerUpdate + 1);

    // Update the cluster icons
    if (clusterRef.current) {
      console.log(clusterMarkers);
    }

    // Get the cluster from the MarkerClusterGroup
    // const clusterGroup = clusterRef.current;
    // console.log(clusterGroup, "clusterGroup");
    // const cluster = clusterGroup.getVisibleParent(updatedMarker);
    // Get the MarkerClusterGroup
    // const clusterGroup = clusterRef.current?.leafletElement;
    // if (clusterGroup) {
    //   // Find the cluster that contains the updated marker
    //   const cluster = clusterGroup.getVisibleParent(
    //     clusterGroup.getAllChildMarkers().find((layer) => {
    //       return (
    //         layer.options.cid === updatedMarker.cid &&
    //         layer.options.type === updatedMarker.type
    //       );
    //     })
    //   );

    //   if (cluster) {
    //     // Update the cluster's icon
    //     const newIcon = ClusterIcon(cluster);
    //     cluster.setIcon(newIcon);
    //   }
    // }
    // Call ClusterIcon with the cluster object
    // if (cluster) {
    //   ClusterIcon(cluster);
    // }
  };

  useEffect(() => {
    if (changedMarker) {
      updateMarker(changedMarker);
      console.log("changed marker");
    }
  }, [changedMarker]);

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      setFilter({
        box: checked,
        camera: checked,
        crossroad: checked,
        trafficlights: checked,
      });
    } else {
      setFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  const handlePopupOpen = (marker) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((m) => {
        if (m.cid === marker.cid && m.type === marker.type) {
          return { ...m, isPopupOpen: true };
        }
        return m;
      })
    );
  };
  const handleRotate = (id) => {
    const marker = markers.find((marker) => marker.id === id);
    setrotated(marker.rotated);
    // setOpenedPopupMarkerId(id);
  };
  const handleMonitorCrossroad = (marker) => {
    setActiveMarker(marker);
    setIsbigMonitorOpen(!isbigMonitorOpen);
  };
  const handleBoxModalOpen = async (box) => {
    if (box) {
      setIsBoxLoading(true);
      try {
        const res = await getBoxData(box.cid);
        setIsBoxLoading(false);
        setActiveBox(res);
        setIsBoxModalOpen(!isBoxModalOpen);
      } catch (error) {
        setIsBoxLoading(false);
        throw new Error(error);
      }
      // setActiveBox(box ? box : null);
    }
  };
  const handleLightsModalOpen = async (light) => {
    console.log(light, "lights");
    if (light) {
      setActiveLight(light);
      setIsLightsModalOpen(true);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: handleMapMove,
    });
    return null;
  };

  const [fulscreen, setFullscreen] = useState(false);

  const toggleFullSceen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };
  const [openPopupIds, setOpenPopupIds] = useState([]);
  return (
    <>
      {" "}
      <MapContainer
        attributionControl={false}
        center={center}
        zoom={zoom}
        maxZoom={18}
        style={{ height: "100vh", width: "100%" }}
        // whenCreated={(mapw) => {
        //   console.log(mapw, "mapw");
        //   map.current = mapw;
        // }}
      >
        <MapEvents />
        {/* <Legend map={map} /> */}
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
        </Control>{" "}
        <Control position="topleft">
          <div
            onClick={toggleFullSceen}
            // variant="outlined"
            className="p-0 bg-white hover:bg-gray-100 rounded text-blue-gray-700 border-2 border-gray-500 cursor-pointer"
          >
            {/* <IconButton ripple={false} color="red"> */}

            {fulscreen ? (
              <ArrowsPointingInIcon className="w-8 h-8 p-1" />
            ) : (
              <ArrowsPointingOutIcon className="w-8  h-8 p-1" />
            )}
            {/* </IconButton> */}
          </div>
        </Control>
        <Control position="topleft">
          <div onClick={handleSidebar} className="z-[9999999]">
            {" "}
            <Badge content={alarmCount} size="sm">
              <div
                // variant="outlined"
                className="p-0 bg-white hover:bg-gray-100 rounded text-blue-gray-700 border-2 border-gray-500 cursor-pointer"
              >
                {/* <IconButton ripple={false} color="red"> */}
                {isSidebarOpen ? (
                  <BellIcon className="w-8 h-8 p-1" />
                ) : (
                  <BellAlertIcon className="w-8 h-8 p-1" />
                )}

                {/* </IconButton> */}
              </div>
            </Badge>
          </div>
        </Control>
        <MarkerClusterGroup
          key={markerUpdate}
          ref={clusterRef}
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
          disableClusteringAtZoom={15}
          zoomToBoundsOnClick={true}
          animate={true}
          animateAddingMarkers={false}
          spiderLegPolylineOptions={{
            weight: 0,
            opacity: 0,
          }}
          iconCreateFunction={(e) => ClusterIcon(e)}
        >
          {markers?.map((marker, i) => {
            if (
              (marker.type === 1 && !filter.camera) ||
              (marker.type === 2 && !filter.crossroad) ||
              (marker.type === 3 && !filter.box) ||
              (marker.type === 4 && !filter.trafficlights)
            ) {
              return null;
            }

            // Skip mapping the marker if lat or lng is undefined
            if (isNaN(Number(marker.lat)) || isNaN(Number(marker.lng))) {
              return null;
            }

            return (
              <>
                {/* <CustomMarker
                  key={i}
                  marker={marker}
                  handleBoxModalOpen={handleBoxModalOpen}
                  handleMarkerDragEnd={handleMarkerDragEnd}
                  handleMonitorCrossroad={handleMonitorCrossroad}
                  handlePopupOpen={handlePopupOpen}
                /> */}
                <Marker
                  // ref={(ref) =>
                  //   (markerRefs[`${marker.cid}-${marker.type}`] = ref)
                  // }
                  key={i}
                  markerId={marker.cid}
                  markerType={marker.type}
                  position={[marker.lat, marker.lng]}
                  draggable={isDraggable}
                  rotationAngle={marker.rotated}
                  eventHandlers={{
                    click:
                      marker.type == 2
                        ? () => handleMonitorCrossroad(marker)
                        : marker.type == 3
                        ? () => handleBoxModalOpen(marker)
                        : marker.type == 4
                        ? () => handleLightsModalOpen(marker)
                        : () => handlePopupOpen(marker),
                    dragend: (event) =>
                      handleMarkerDragEnd(marker.cid, marker.type, event),
                    // popupopen: () => handleRotate(marker.id),
                  }}
                  statuserror={marker.statuserror}
                  icon={L.icon({
                    iconUrl: `icons/${marker.icon}`,
                    iconSize: [32, 32],
                  })}
                  rotatedAngle={marker.type === 3 ? marker.rotated : 0}
                >
                  {" "}
                  {/* <Fragment key={i}>
                  {marker.type !== 2 && marker.type !== 3 && (
                    <Popup
                      interactive
                      minWidth={"600px"}
                      closeOnClick={false}
                      autoClose={false}
                      keepInView
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
                </Fragment> */}
                  {marker.type === 1 && (
                    <CustomPopUp
                      marker={marker}
                      openPopupData={openPopupIds}
                      setOpenPopupData={setOpenPopupIds}
                    />
                  )}
                  <Tooltip direction="top">
                    {marker.type == 1 && (
                      <div className="w-[30vw]">
                        <img
                          src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
                          className="w-full"
                          alt=""
                        />
                      </div>
                    )}
                    <Typography>{marker?.cname}</Typography>
                  </Tooltip>
                </Marker>
              </>
            );
          })}{" "}
        </MarkerClusterGroup>{" "}
        {/* <Popup position={["41.2995", "69.2401"]}>something </Popup> */}
        {/* <CustomPopUps markers={markers} handleOpen={handlePopupOpen} /> */}
      </MapContainer>{" "}
      {isbigMonitorOpen && (
        <MonitoringModal
          marker={activeMarker}
          open={isbigMonitorOpen}
          handleOpen={() => {
            setIsbigMonitorOpen(false);
            setActiveMarker(null);
          }}
        />
      )}
      <DeviceModal
        device={activeBox}
        isDialogOpen={isBoxModalOpen}
        isLoading={isBoxLoading}
        handler={() => {
          setIsBoxModalOpen(false);
          setActiveBox(null);
        }}
      />
      <TrafficLightsModal
        light={activeLight}
        isDialogOpen={isLightsModalOpen}
        isLoading={isLightsLoading}
        handler={() => {
          setIsLightsModalOpen(false);
          setActiveLight(null);
        }}
      />
    </>
  );
};

export default MapComponent;
const ClusterIcon = (cluster) => {
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));
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
        />
      </div>
    ),
  });
  return pieChartIcon;
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
