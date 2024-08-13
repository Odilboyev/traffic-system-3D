import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-rotatedmarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  Checkbox,
  IconButton,
  Radio,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Switch,
  Typography,
} from "@material-tailwind/react";
import Control from "../CustomControl";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog8ToothIcon,
  LanguageIcon,
  ListBulletIcon,
  MapIcon,
} from "@heroicons/react/16/solid";
import "./mapStyles.css";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import {
  getBoxData,
  GetCurrentAlarms,
  getErrorHistory,
  getInfoForCards,
  getMarkerData,
  markerHandler,
  subscribeToCurrentAlarms,
} from "../../api/apiHandlers";
import login from "../../Auth";
import { useNavigate } from "react-router-dom";
import MonitoringModal from "./components/crossroad";
import DeviceModal from "./components/box/deviceModal";
import CustomPopUp from "./components/customPopup";
import baseLayers, { layerSave } from "../../configurations/mapLayers";
import TrafficLightsModal from "./components/trafficLights/modal";
import dangerSound from "../../assets/audio/danger.mp3";
import toaster, { toastConfig } from "../../tools/toastconfig";
import CurrentAlarms from "./components/alarm";
import Dropright from "../Dropright";
import { FaClockRotateLeft } from "react-icons/fa6";
import HistoryTable from "./components/alarm/history";
import ZoomControl from "./components/CustomZoomControl";
import { TbBell, TbBellRinging, TbLamp } from "react-icons/tb";
import DropdownControl from "../DropDownControl";
import { useTheme } from "../../customHooks/useTheme";
import { IoMdSunny } from "react-icons/io";
import ClockOnMap from "./components/weather";
import BottomSection from "../infoCard";
import NeonIcon from "../neonIcon";
import { LiaTrafficLightSolid } from "react-icons/lia";
import { MdBedtime, MdOutlineSensorWindow } from "react-icons/md";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../langSwitcher";
import Svetoforlar from "./components/svetofor";

const home = [41.2995, 69.2401];

const handleMapMove = (event) => {
  // Save center and zoom values to localStorage
  const newCenter = event.target.getCenter();
  const newZoom = event.target.getZoom();

  localStorage.setItem("mapCenter", JSON.stringify(newCenter));
  localStorage.setItem("mapZoom", newZoom);
};

const MapComponent = ({ changedMarker }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  // language `-`
  const { t } = useTranslation();

  //theme
  const { theme, toggleTheme } = useTheme();
  //layers
  const [selectedLayer, setSelectedLayer] = useState(
    localStorage.getItem("selectedLayer") || baseLayers[0].name
  );
  const filteredLayers =
    theme === "dark"
      ? baseLayers.filter((layer) => layer.name.includes("Dark"))
      : baseLayers.filter((layer) => !layer.name.includes("Dark"));
  const [center] = useState(
    JSON.parse(localStorage.getItem("mapCenter"))
      ? JSON.parse(localStorage.getItem("mapCenter"))
      : home
  );
  const [zoom, setZoom] = useState(
    localStorage.getItem("mapZoom") ? localStorage.getItem("mapZoom") : 13
  );
  const currentLayer = baseLayers.find((layer) => layer.name === selectedLayer);

  const handleLayerChange = (layerName) => {
    setSelectedLayer(layerName);
    layerSave("selectedLayer", layerName);
  };
  useEffect(() => {
    if (theme === "dark") {
      handleLayerChange("Dark");
    } else {
      handleLayerChange("2GIS");
      setZoom(17);
    }
  }, [theme]);
  //navigate
  const navigate = useNavigate();
  //variables
  //error message
  const [errorMessage, setErrorMessage] = useState(null);
  /// ----------------------------------------------------------------
  const [isbigMonitorOpen, setIsbigMonitorOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [clusterMarkers, setClusterMarkers] = useState([]);

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [activeBox, setActiveBox] = useState(null);

  const [isLightsModalOpen, setIsLightsModalOpen] = useState(false);
  const [isLightsLoading, setIsLightsLoading] = useState(false);
  const [activeLight, setActiveLight] = useState(26);

  const [markers, setMarkers] = useState([]);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [rotated, setrotated] = useState(0);
  const [isDraggable, setiIsDraggable] = useState(false);
  // const [types, setTypes] = useState(0);
  const [filter, setFilter] = useState({
    box: true,
    camera: true,
    crossroad: true,
    trafficlights: true,
  });
  console.log(t("more2"), "all");
  const checkboxConfigurations = [
    { type: "all", label: t("all") },
    { type: "box", label: "Box" },
    { type: "camera", label: "Cameras" },
    { type: "crossroad", label: "Crossroads" },
    { type: "trafficlights", label: "Traffic Lights" },
  ];

  const getDataHandler = async () => {
    setAreMarkersLoading(true);
    try {
      setAreMarkersLoading(false);
      const myData = await getMarkerData();
      if (myData?.status == 999) {
        localStorage.clear();
        login.logout();
        navigate("/", { replace: true });
        localStorage.setItem("data-to-debug", JSON.stringify(myData));
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
      setAreMarkersLoading(false);
      if (error.code === "ERR_NETWORK") {
        setErrorMessage("You are offline. Please try again");
      }
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
  const [markerUpdate, setMarkerUpdate] = useState(0);
  const clusterRef = useRef(null);

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
  // ----------------------------------------------------------------
  /// alarms
  const [currentAlarms, setCurrentAlarms] = useState(null);
  const [changedMarkerForAlarm, setChangedMarker] = useState(null);
  const [isAlarmsOpen, setIsAlarmsOpen] = useState(false);
  const [bottomSectionData, setBottomSectionData] = useState(null);
  useEffect(() => {
    console.log(isAlarmsOpen, "alarms open");
  }, [isAlarmsOpen]);

  useEffect(() => {
    fetchData();
    subscribeToCurrentAlarms(onWSDataReceived);
  }, []);

  const onWSDataReceived = (data) => {
    if (data.marker !== undefined && data.marker !== null) {
      setChangedMarker(data.marker);
    }

    if (data.status === "update") {
      toaster(data.data, toastConfig);
      fetchData();
      const sound = new Audio();
      if (data.data.statuserror === 1) {
        sound.src = dangerSound;
      } else if (data.data.statuserror === 2) {
        sound.src = dangerSound;
      }
      sound.play();
    }
  };

  const fetchData = async () => {
    try {
      const [alarmsRes, infoRes] = await Promise.all([
        GetCurrentAlarms(),
        getInfoForCards(),
      ]);

      setCurrentAlarms(alarmsRes.data);
      setBottomSectionData(infoRes);
      console.log(infoRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error);
    }
  };

  // history of alarms
  const [isAlarmHistoryOpen, setIsAlarmHistoryOpen] = useState(false);
  const itemsPerPage = 10; // Number of items to display per page
  const [historyData, setHistoryData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);

  const fetchErrorHistory = async (current) => {
    setHistoryLoading(true);
    try {
      const all = await getErrorHistory(current);

      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
      historyData.length === 0 && setIsDataLoaded(true);
      setHistoryLoading(false);
    } catch (err) {
      setHistoryLoading(false);
      console.log("Error fetching error history. Please try again.");
    }
  };

  return (
    <>
      <MapContainer
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={zoom}
        maxZoom={22}
        zoomDelta={0.6}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        {errorMessage && (
          <div className="w-[50vw] h-[20vh] z-[9999] rounded-md bg-white backdrop-blur-md flex justify-center items-center dark:text-white">
            {errorMessage}
          </div>
        )}
        <MapEvents />
        {currentLayer && (
          <TileLayer
            maxNativeZoom={22}
            url={currentLayer.url}
            attribution={currentLayer.attribution}
            key={currentLayer.name}
            maxZoom={22}
          />
        )}
        {/* zoomcontrol */}
        <ZoomControl theme={theme} />
        {/* clock */}
        <ClockOnMap />
        {/* bottomsection */}
        <BottomSection cardsInfoData={bottomSectionData} />
        {/* lights */}
        <Svetoforlar />
        <Control position="topleft">
          <SpeedDial placement="right">
            <IconButton
              // color={theme === "light" ? "black" : "white"}
              size="lg"
            >
              <SpeedDialHandler className="w-10 h-10 cursor-pointer">
                <ListBulletIcon className="w-5 h-5 p-2" />
              </SpeedDialHandler>
            </IconButton>
            <SpeedDialContent className="ml-4">
              <div className="filter-panel p-2 flex flex-col dark:bg-gray-900/80 text-blue-gray-900 dark:text-white bg-white/80 backdrop-blur-md">
                {checkboxConfigurations.map(({ type, label }) => (
                  <Checkbox
                    key={type}
                    label={
                      <Typography className="dark:text-white text-blue-gray-800">
                        {label}
                      </Typography>
                    }
                    ripple={false}
                    className="m-0 p-0"
                    checked={
                      type === "all"
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
        <Control position="topleft">
          <SpeedDial placement="right">
            <IconButton
              // color={theme === "light" ? "black" : "white"}
              size="lg"
            >
              <SpeedDialHandler className="rounded w-10 h-10 cursor-pointer">
                <Cog8ToothIcon className="w-5 h-5 p-2" />
              </SpeedDialHandler>
            </IconButton>
            <SpeedDialContent className="ml-4 dark:bg-gray-900/80 dark:text-white text-blue-gray-900 bg-white/80 backdrop-blur-md">
              <div className="p-4 rounded-lg flex flex-col justify-center items-center">
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
        <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={toggleFullSceen}
          >
            {fulscreen ? (
              <ArrowsPointingInIcon className="w-8 h-8 p-1" />
            ) : (
              <ArrowsPointingOutIcon className="w-8 h-8 p-1" />
            )}
          </IconButton>
        </Control>
        <Control position="topleft">
          <SpeedDial placement="left">
            <IconButton
              // color={theme === "light" ? "black" : "white"}
              size="lg"
            >
              <SpeedDialHandler className="w-10 h-10 cursor-pointer">
                <MapIcon className="w-6 h-6 p-2" />
              </SpeedDialHandler>
            </IconButton>
            <SpeedDialContent className="m-4">
              <div className="flex flex-col p-3 mb-10 rounded-md dark:bg-gray-900/80 text-blue-gray-900 bg-white/80 backdrop-blur-md">
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
        <LanguageSwitcher position={"topleft"} />
        <Control className="z-[999999]" position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() => setIsAlarmsOpen(!isAlarmsOpen)}
          >
            {isAlarmsOpen ? (
              <TbBell className="w-6 h-6" />
            ) : (
              <TbBellRinging className="w-6 h-6" />
            )}
          </IconButton>
          <Dropright
            isOpen={isAlarmsOpen}
            setIsOpen={setIsAlarmsOpen}
            content={
              <CurrentAlarms
                data={currentAlarms}
                historyOpen={isAlarmHistoryOpen}
                setHistoryOpen={setIsAlarmHistoryOpen}
              />
            }
          />
        </Control>
        <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() => setIsAlarmHistoryOpen(!isAlarmHistoryOpen)}
          >
            <FaClockRotateLeft className="w-6 h-6 p-1" />
          </IconButton>
          <HistoryTable
            open={isAlarmHistoryOpen}
            handleOpen={() => setIsAlarmHistoryOpen(!isAlarmHistoryOpen)}
            data={historyData}
            isLoading={historyLoading}
            itemsPerPage={itemsPerPage}
            historyTotalPages={historyTotalPages}
            fetchErrorHistory={fetchErrorHistory}
          />
        </Control>
        <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() => toggleTheme()}
          >
            {theme === "light" ? (
              <MdBedtime className="w-7 h-7 p-1" />
            ) : (
              <IoMdSunny className="w-7 h-7 p-1" />
            )}
          </IconButton>
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
          iconCreateFunction={(e) => ClusterIcon(e, changedMarker)}
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
                <Marker
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
                  }}
                  statuserror={marker.statuserror}
                  icon={L.icon({
                    iconUrl: `icons/${marker.icon}`,
                    iconSize: [32, 32],
                  })}
                  rotatedAngle={marker.type === 3 ? marker.rotated : 0}
                >
                  {marker.type === 1 && (
                    <CustomPopUp
                      marker={marker}
                      openPopupData={openPopupIds}
                      setOpenPopupData={setOpenPopupIds}
                    />
                  )}
                  {/*  <div className="w-10 h-10">
                        <NeonIcon
                          status={marker.statuserror}
                          icon={
                            marker.icon === "camera"
                              ? CameraIcon
                              : marker.icon === "crossroad"
                              ? GiCrossroad
                              : marker.icon === "svetofor"
                              ? LiaTrafficLightSolid
                              : MdOutlineSensorWindow
                          }
                        />
                      </div> */}
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
const ClusterIcon = (cluster, changedMarker) => {
  const childMarkers = cluster.getAllChildMarkers();
  const statusCounts = {};
  let isHighlighted = false;

  childMarkers.forEach((marker) => {
    const status = marker.options.statuserror;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    // if (
    //   marker.options.cid === changedMarker?.cid &&
    //   marker.options.type === changedMarker?.type
    // ) {
    //   isHighlighted = true;
    // }
  });

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: parseInt(status),
    count,
  }));

  const pieChartIcon = L.divIcon({
    className: `cluster !bg-transparent `,
    iconSize: L.point(50, 50),
    html: renderToString(
      <div
        className={`w-20 h-20 !bg-transparent  group-has-[div]:!bg-transparent  ${
          isHighlighted ? "animate-pulse" : ""
        }`}
      >
        <PieChart
          data={pieChartData.map((datam) => ({
            value: datam.count,
            title: datam.status,
            color: getStatusColor(datam.status),
          }))}
          style={{
            filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))`,
            background: "transparent !important",
          }}
          segmentsStyle={{
            transition: "stroke .3s",
            cursor: "pointer",
            // filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          }}
          segmentsShift={1}
          radius={42}
          labelStyle={{
            fill: "#fff",
            fontSize: "0.9rem",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
          tooltip={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
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
      return "#FFD700"; // orange
    case 2:
      return "#FF4500"; // red
    case 3:
      return "#FFC0CB"; // pink
    default:
      return "#4682B4"; // green
  }
};
