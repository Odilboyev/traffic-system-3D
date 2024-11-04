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
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdSunny } from "react-icons/io";
import { MdBedtime } from "react-icons/md";
import { TbBell, TbBellRinging } from "react-icons/tb";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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
import MarkerComponent from "./components/genericMarkers";
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

  // useEffect(() => {
  //   changedMarker &&
  //     setMarkers((markers) => {
  //       markers.map(
  //         (marker) =>
  //           marker.cid == changedMarker.cid && marker.type == changedMarker.type
  //       );
  //       return markers;
  //     });
  // }, [changedMarker]);

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
    // getDataHandler();
    fetchAlarmsData();
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

  const clearMarkers = () => {
    setMarkers([]);
  };

  const updateMarkers = (data) => {
    if (data) {
      setMarkers(data);
    }
  };

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
        <MarkerComponent
          handleMonitorCrossroad={handleMonitorCrossroad}
          handleBoxModalOpen={handleBoxModalOpen}
          handleLightsModalOpen={handleLightsModalOpen}
          handleMarkerDragEnd={handleMarkerDragEnd}
          markers={markers}
          setMarkers={setMarkers}
          clearMarkers={clearMarkers}
          updateMarkers={updateMarkers}
        />
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
