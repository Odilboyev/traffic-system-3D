import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Tooltip,
  useMap,
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
import Control from "../customControl";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog8ToothIcon,
  ListBulletIcon,
  MapIcon,
} from "@heroicons/react/16/solid";
import "./mapStyles.css";
import { PieChart } from "react-minimal-pie-chart";
import { renderToString } from "react-dom/server";
import {
  getBoxData,
  getCurrentAlarms,
  getInfoForCards,
  getMarkerData,
  markerHandler,
  subscribeToCurrentAlarms,
} from "../../api/api.handlers";
import login from "../../Auth";
import { useNavigate } from "react-router-dom";
import CorssroadModal from "./components/crossroad";
import DeviceModal from "./components/box/deviceModal";
import CustomPopUp from "./components/customPopup/index.jsx";
import baseLayers, { layerSave } from "../../configurations/mapLayers";
import TrafficLightsModal from "./components/trafficLights/modal";
import dangerSound from "../../assets/audio/danger.mp3";
import toaster, { toastConfig } from "../../tools/toastconfig";
import CurrentAlarms from "./components/alarm";
import Dropright from "../dropright";
import { TbBell, TbBellRinging } from "react-icons/tb";
import { useTheme } from "../../customHooks/useTheme";
import { IoMdSunny } from "react-icons/io";
import WeatherWidget from "./components/weather";
import BottomSection from "../infoCard";
import { MdBedtime } from "react-icons/md";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../langSwitcher";
import Svetoforlar from "./components/svetofor";
import DeviceManagement from "../deviceManagement";
import AlarmHistory from "./components/caseHistory";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import FilterControl from "./components/controls/filterControl/index.jsx";
import WidgetControl from "./components/controls/widgetControl/index.jsx";
import useLocalStorageState from "../../customHooks/uselocalStorageState.jsx";

const home = [41.2995, 69.2401];

const handleMapMove = (event) => {
  // Save center and zoom values to localStorage
  const newCenter = event.target.getCenter();
  const newZoom = event.target.getZoom();

  localStorage.setItem("mapCenter", JSON.stringify(newCenter));
  localStorage.setItem("mapZoom", newZoom);
};
//

const MapEvents = ({ changedMarker, fetchAlarmsData }) => {
  const map = useMap();

  useMapEvents({
    moveend: handleMapMove, // Assuming you have a handleMapMove function defined
  });

  useEffect(() => {
    if (changedMarker) {
      fetchAlarmsData();
      toaster(changedMarker, map); // Pass the map instance if necessary
    }
  }, [changedMarker, map]);

  return null; // This component does not render anything
};

const MapComponent = ({ changedMarker }) => {
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
  const center = JSON.parse(localStorage.getItem("mapCenter"))
    ? JSON.parse(localStorage.getItem("mapCenter"))
    : home;
  const zoom = localStorage.getItem("mapZoom")
    ? localStorage.getItem("mapZoom")
    : 13;

  const currentLayer = baseLayers.find((layer) => layer.name === selectedLayer);
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

  const handleLayerChange = (layerName) => {
    setSelectedLayer(layerName);
    layerSave(layerName);
  };

  useEffect(() => {
    if (theme === "dark") {
      handleLayerChange("Dark");
    } else {
      handleLayerChange("Transport");
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

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [activeBox, setActiveBox] = useState(null);

  const [isLightsModalOpen, setIsLightsModalOpen] = useState(false);
  const [isLightsLoading, setIsLightsLoading] = useState(false);
  const [activeLight, setActiveLight] = useState(26);

  const [markers, setMarkers] = useState([]);
  const [bottomSectionData, setBottomSectionData] = useState(null);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [filter, setFilter] = useLocalStorageState("traffic_filter", {
    box: true,
    camera: true,
    crossroad: true,
    trafficlights: true,
  });
  const [widgets, setWidgets] = useLocalStorageState("traffic_widgets", {
    bottomsection: true,
    weather: true,
  });
  const [isDraggable, setIsDraggable] = useLocalStorageState(
    "traffic_isDraggable",
    false
  );

  useEffect(() => {
    changedMarker &&
      setMarkers((markers) => {
        markers.map(
          (marker) =>
            marker.cid == changedMarker.cid && marker.type == changedMarker.type
        );
        return markers;
      });
  }, [changedMarker]);

  const getDataHandler = async () => {
    setAreMarkersLoading(true);
    try {
      setAreMarkersLoading(false);
      const [myData, bottomData] = await Promise.all([
        getMarkerData(),
        getInfoForCards(),
      ]);
      setMarkers(
        myData.data.map((marker) => ({
          ...marker,
          isPopupOpen: false,
        }))
      );
      setBottomSectionData(bottomData);
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
    fetchAlarmsData();
    return () => {
      setMarkers([]);
    };
  }, []);
  useEffect(() => {
    console.log(markers, "markers changed");
  }, [markers]);
  useEffect(() => {
    console.log(changedMarker, "changed marker");
  }, [changedMarker]);

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
  };

  useEffect(() => {
    if (changedMarker) {
      updateMarker(changedMarker);
    }
  }, [changedMarker]);

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
    if (light) {
      setActiveLight(light);
      setIsLightsModalOpen(true);
    }
  };
  // ----------------------------------------------------------------
  /// alarms
  const [currentAlarms, setCurrentAlarms] = useState(null);
  const [isAlarmsOpen, setIsAlarmsOpen] = useState(false);

  const fetchAlarmsData = async () => {
    try {
      const alarmsRes = await getCurrentAlarms();
      setCurrentAlarms(alarmsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error(error);
    }
  };

  return (
    <>
      <MapContainer
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={zoom}
        maxZoom={theme === "dark" ? 22 : 18}
        zoomDelta={0.6}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        {errorMessage && (
          <div className="w-[50vw] h-[20vh] z-[9999] rounded-md bg-blue-gray-900 backdrop-blur-md flex justify-center items-center text-white">
            {errorMessage}
          </div>
        )}
        <MapEvents
          changedMarker={changedMarker}
          fetchAlarmsData={fetchAlarmsData}
        />
        {currentLayer && (
          <TileLayer
            maxNativeZoom={currentLayer.maxNativeZoom}
            url={currentLayer.url}
            attribution={currentLayer.attribution}
            key={currentLayer.name}
            maxZoom={22}
          />
        )}
        {/* zoomcontrol */}
        <ZoomControl theme={theme} />{" "}
        <Control position="topleft">
          <FilterControl
            filter={filter}
            changeFilter={setFilter}
            placement={"right"}
          />
        </Control>
        {/* widgets */}
        <div className={widgets.weather ? "visible" : "invisible"}>
          {" "}
          <WeatherWidget />
        </div>
        <div className={widgets.bottomsection ? "visible" : "invisible"}>
          {" "}
          <BottomSection cardsInfoData={bottomSectionData} />
        </div>
        {/* lights */}
        <Svetoforlar />
        {/* settings */}
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
            <SpeedDialContent className="ml-4 rounded-md bg-gray-900/80 text-white backdrop-blur-md">
              <div className="p-4 rounded-lg flex flex-col">
                <Typography className="text-sm ">{t("markers")}</Typography>
                <Checkbox
                  label={
                    <Typography className="text-white">
                      {/* {isDraggable ? "Editable" : "Not Editable"} */}
                      {t("draggable")}
                    </Typography>
                  }
                  ripple={false}
                  checked={isDraggable}
                  onChange={(e) => setIsDraggable(e.target.checked)}
                />{" "}
                <div className="border-t border-y-gray-800 w-full my-2"></div>
                <Typography className=" text-sm">{t("widgets")}</Typography>
                <WidgetControl
                  filter={widgets}
                  changeFilter={setWidgets}
                  placement={"right"}
                />
              </div>
            </SpeedDialContent>
          </SpeedDial>
        </Control>
        {/* aalarm history */}
        <Control position="topleft">
          <AlarmHistory />
        </Control>
        {/* Device Management */}
        <Control position="topleft">
          <DeviceManagement />
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
              <div className="flex flex-col p-3 mb-10 rounded-md bg-gray-900/80 text-blue-gray-900 backdrop-blur-md">
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
            content={<CurrentAlarms data={currentAlarms} />}
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
                        : null,
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
                  {marker.type === 1 && <CustomPopUp marker={marker} />}
                  <Tooltip direction="top">
                    {marker.type == 1 ? (
                      <div
                        style={{
                          width: "8vw",
                          height: "6vw",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={`https://trafficapi.bgsoft.uz/upload/camerascreenshots/${marker.cid}.jpg`}
                          className="w-full"
                          alt=""
                        />
                        <Typography className="my-0">
                          {marker?.cname}
                        </Typography>
                      </div>
                    ) : (
                      <Typography className="my-0">{marker?.cname}</Typography>
                    )}
                  </Tooltip>
                </Marker>
              </>
            );
          })}{" "}
        </MarkerClusterGroup>
      </MapContainer>
      {isbigMonitorOpen && (
        <CorssroadModal
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
