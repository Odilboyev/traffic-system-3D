import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog8ToothIcon,
} from "@heroicons/react/16/solid";
import {
  Checkbox,
  IconButton,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Typography,
} from "@material-tailwind/react";
import L from "leaflet";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { useTranslation } from "react-i18next";
import { IoMdSunny } from "react-icons/io";
import { MdBedtime } from "react-icons/md";
import { TbBell, TbBellRinging } from "react-icons/tb";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { PieChart } from "react-minimal-pie-chart";
import { ToastContainer } from "react-toastify";
import {
  getBoxData,
  getCurrentAlarms,
  getInfoForCards,
  getMarkerData,
  markerHandler,
} from "../../api/api.handlers.js";
import Control from "../../components/customControl/index.jsx";
import BottomSection from "../../components/infoCard/index.jsx";
import SidePanel from "../../components/sidePanel/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import { useTheme } from "../../customHooks/useTheme.jsx";
import useLocalStorageState from "../../customHooks/uselocalStorageState.jsx";
import toaster from "../../tools/toastconfig.jsx";
import DeviceModal from "./components/box/deviceModal.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import FilterControl from "./components/controls/filterControl/index.jsx";
import WidgetControl from "./components/controls/widgetControl/index.jsx";
import CrossroadModal from "./components/crossroad/index.jsx";
import CurrentAlarms from "./components/currentAlarms/index.jsx";
import CustomPopup from "./components/customPopup/index.jsx";
import SignsContainer from "./components/signs/index.jsx";
import TileChanger from "./components/tileChanger/index.jsx";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import TrafficLightsModal from "./components/trafficLightsModal/index.jsx";
import UserInfoWidget from "./components/userInfo/index.jsx";
import WeatherWidget from "./components/weather/index.jsx";
import DeviceErrorHistory from "./sections/deviceErrorHistory/index.jsx";
import DeviceManagement from "./sections/deviceManagement/index.jsx";
import LanguageSwitcher from "./sections/langSwitcher/index.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapEvents = ({ changedMarker, fetchAlarmsData }) => {
  const map = useMap();
  const lastToastRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const moveEndHandler = () => {
      const newCenter = map.getCenter();
      const newZoom = map.getZoom();
      localStorage.setItem("mapCenter", JSON.stringify(newCenter));
      localStorage.setItem("mapZoom", newZoom);
    };

    map.on("moveend", moveEndHandler);

    return () => {
      map.off("moveend", moveEndHandler);
    };
  }, [map]);

  useEffect(() => {
    if (changedMarker && lastToastRef.current !== changedMarker.eventdate) {
      fetchAlarmsData();
      toaster(changedMarker, map);
      lastToastRef.current = changedMarker.eventdate;
    }
  }, [changedMarker, map, fetchAlarmsData]);

  return null;
};

MapEvents.propTypes = {
  changedMarker: PropTypes.object,
  fetchAlarmsData: PropTypes.func.isRequired,
};

const MapComponent = ({ changedMarker }) => {
  // user role
  const role = atob(localStorage.getItem("its_user_role"));
  const isPermitted = role === "admin" || role === "boss";
  // language `-`
  const { t } = useTranslation();
  //theme
  const { theme, toggleTheme, currentLayer } = useTheme();

  const center = JSON.parse(localStorage.getItem("mapCenter"))
    ? JSON.parse(localStorage.getItem("mapCenter"))
    : home;
  const zoom = localStorage.getItem("mapZoom")
    ? localStorage.getItem("mapZoom")
    : 13;

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
  const [activeLight, setActiveLight] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [bottomSectionData, setBottomSectionData] = useState(null);
  const [areMarkersLoading, setAreMarkersLoading] = useState(false);
  const [filter, setFilter] = useLocalStorageState("traffic_filter", {
    box: true,
    crossroad: true,
    trafficlights: true,
    signs: true,
    camera: true,
    cameraview: true,
    camerapdd: true,
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
  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);
  return (
    <>
      <MapContainer
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={zoom}
        zoomDelta={0.6}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <ToastContainer containerId="alarms" className="z-[9998]" />
        {errorMessage && (
          <div className="w-[50vw] h-[20vh] z-[9999] rounded-md bg-blue-gray-900 backdrop-blur-md flex justify-center items-center text-white">
            {errorMessage}
          </div>
        )}
        <MapEvents
          changedMarker={changedMarker}
          fetchAlarmsData={fetchAlarmsData}
        />
        {currentLayerDetails && (
          <TileLayer
            maxNativeZoom={currentLayerDetails.maxNativeZoom}
            url={currentLayerDetails.url}
            attribution={currentLayerDetails.attribution}
            key={currentLayerDetails.name}
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
        {/* layerchanger */}
        <TileChanger />
        {/* widgets */}
        {/* user profile */}
        <Control position="topright">
          <UserInfoWidget />
        </Control>
        {/* weather */}
        <Control position="topright">
          {widgets.weather ? (
            <WeatherWidget />
          ) : (
            <div style={{ display: "none" }}></div>
          )}
        </Control>
        {widgets.bottomsection && (
          <div className="visible">
            <BottomSection cardsInfoData={bottomSectionData} />
          </div>
        )}
        {/* lights */}
        {filter.trafficlights && <TrafficLightContainer />}
        {/* signs  */}
        {<SignsContainer isVisible={filter.signs} />}
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
          <DeviceErrorHistory />
        </Control>
        {/* Device Management */}
        {isPermitted && (
          <Control position="topleft">
            <DeviceManagement refreshHandler={getDataHandler} />
          </Control>
        )}
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
          <SidePanel
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
          // spiderLegPolylineOptions={{
          //   weight: 5,
          //   opacity: 1,
          // }}
          iconCreateFunction={(e) => ClusterIcon(e, changedMarker)}
        ></MarkerClusterGroup>
        <Marker
          markerId={"34"}
          position={[41.34104414093939, 69.2542765849464]}
          icon={L.icon({
            iconUrl: `icons/box1.png`,
            iconSize: [32, 32],
          })}
        ></Marker>
        <Marker
          markerId={"39"}
          position={[41.3410441409394, 69.2542765849485]}
          icon={L.icon({
            iconUrl: `icons/box2.png`,
            iconSize: [32, 32],
          })}
        ></Marker>
        <Marker
          markerId={"30"}
          position={[41.34104414093941, 69.2542765849466]}
          icon={L.icon({
            iconUrl: `icons/box0.png`,
            iconSize: [32, 32],
          })}
        ></Marker>
        {markers?.map((marker) => {
          if (
            (marker.type === 1 && !filter.camera) ||
            (marker.type === 2 && !filter.crossroad) ||
            (marker.type === 3 && !filter.box) ||
            (marker.type === 4 && !filter.trafficlights) ||
            (marker.type === 6 && !filter.camerapdd) ||
            (marker.type === 5 && !filter.cameraview)
          ) {
            return null;
          }

          if (isNaN(Number(marker.lat)) || isNaN(Number(marker.lng))) {
            return null;
          }

          return (
            <Fragment key={`${marker.cid}-${marker.type}`}>
              <Marker
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
                  iconSize: [40, 40],
                })}
                rotatedAngle={marker.type === 3 ? marker.rotated : 0}
              >
                {marker.type === 1 || marker.type === 5 || marker.type === 6 ? (
                  <CustomPopup marker={marker} />
                ) : null}
                <Tooltip direction="top" className="rounded-md">
                  {marker.type == 1 || marker.type == 5 || marker.type == 6 ? (
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
                      <Typography className="my-0">{marker?.cname}</Typography>
                    </div>
                  ) : (
                    <Typography className="my-0">{marker?.cname}</Typography>
                  )}
                </Tooltip>
              </Marker>
            </Fragment>
          );
        })}{" "}
      </MapContainer>
      {isbigMonitorOpen && (
        <CrossroadModal
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

MapComponent.propTypes = {
  changedMarker: PropTypes.object,
};

export default MapComponent;

const ClusterIcon = (cluster) => {
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
          data={pieChartData.map((datam, key) => ({
            value: datam.count,
            title: datam.status,
            color: getStatusColor(datam.status),
            key,
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
