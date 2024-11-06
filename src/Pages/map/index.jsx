import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog8ToothIcon,
} from "@heroicons/react/16/solid";
import {
  Checkbox,
  IconButton,
  Radio,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLocationDot, FaRegMap } from "react-icons/fa6";
import { IoMdSunny } from "react-icons/io";
import { MdBedtime } from "react-icons/md";
import { TbBell, TbBellRinging } from "react-icons/tb";
import { MapContainer, TileLayer } from "react-leaflet";
import { ToastContainer } from "react-toastify";
import { getBoxData, markerHandler } from "../../api/api.handlers.js";
import Control from "../../components/customControl/index.jsx";
import SidePanel from "../../components/sidePanel/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import { useTheme } from "../../customHooks/useTheme.jsx";
import MapEvents from "./components/MapEvents/index.jsx";
import MapModals from "./components/MapModals/index.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import FilterControl from "./components/controls/filterControl/index.jsx";
import WidgetControl from "./components/controls/widgetControl/index.jsx";
import CurrentAlarms from "./components/currentAlarms/index.jsx";
import ClusteredMarkers from "./components/markers/ClusteredMarkers.jsx";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import SignsContainer from "./components/signs/index.jsx";
import TileChanger from "./components/tileChanger/index.jsx";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import { PROVINCES } from "./constants/provinces.js";
import { useMapAlarms } from "./hooks/useMapAlarms.js";
import { useMapControls } from "./hooks/useMapControls.js";
import { useMapMarkers } from "./hooks/useMapMarkers.js";
import DeviceErrorHistory from "./sections/deviceErrorHistory/index.jsx";
import DeviceManagement from "./sections/deviceManagement/index.jsx";
import LanguageSwitcher from "./sections/langSwitcher/index.jsx";
import BottomSection from "./widgets/infoWidget/index.jsx";
import UserInfoWidget from "./widgets/userInfo/index.jsx";
import WeatherWidget from "./widgets/weather/index.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapComponent = ({ changedMarker }) => {
  const {
    markers,
    setMarkers,
    bottomSectionData,
    getDataHandler,
    clearMarkers,
    updateMarkers,
  } = useMapMarkers();

  const { currentAlarms, fetchAlarmsData } = useMapAlarms();

  const {
    activeSidePanel,
    setActiveSidePanel,
    filter,
    setFilter,
    widgets,
    setWidgets,
    isDraggable,
    setIsDraggable,
  } = useMapControls();

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
  const [zoom, setZoom] = useState(
    localStorage.getItem("mapZoom") ? localStorage.getItem("mapZoom") : 13
  );

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
  /// ----------------------------------------------------------------
  const [isbigMonitorOpen, setIsbigMonitorOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [activeBox, setActiveBox] = useState(null);

  const [isLightsModalOpen, setIsLightsModalOpen] = useState(false);
  const [isLightsLoading, setIsLightsLoading] = useState(false);
  const [activeLight, setActiveLight] = useState(null);

  const [useClusteredMarkers, setUseClusteredMarkers] = useState(
    role === "boss"
      ? "clustered"
      : role === "operator"
      ? "dynamic"
      : "clustered_dynamically"
  );

  useEffect(() => {
    getDataHandler();
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
    setIsbigMonitorOpen(true);
    console.log(marker);
  };
  useEffect(() => {
    console.log(activeMarker, "activeMarker");
  }, [activeMarker]);
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

  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);

  const handleProvinceChange = (value) => {
    const selectedProvince = PROVINCES[value];
    if (selectedProvince && map.current) {
      map.current.flyTo(selectedProvince.coords, 10, {
        duration: 1,
      });
    }
  };

  const map = useRef(null);

  const handleCloseCrossroadModal = () => {
    setIsbigMonitorOpen(false);
    setActiveMarker(null);
  };

  const handleCloseDeviceModal = () => {
    setIsBoxModalOpen(false);
    setActiveBox(null);
    setIsBoxLoading(false);
  };

  const handleCloseTrafficLightsModal = () => {
    setIsLightsModalOpen(false);
    setActiveLight(null);
    setIsLightsLoading(false);
  };

  // Add useEffect to handle changedMarker updates
  useEffect(() => {
    if (changedMarker) {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.cid === changedMarker.cid && marker.type === changedMarker.type
            ? changedMarker
            : marker
        )
      );
    }
  }, [changedMarker]);

  return (
    <>
      <MapContainer
        ref={map}
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={zoom}
        zoomDelta={0.6}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <ToastContainer containerId="alarms" className="z-[9998]" />
        <MapEvents
          changedMarker={changedMarker}
          fetchAlarmsData={fetchAlarmsData}
          setZoom={setZoom}
        />
        {currentLayerDetails && (
          <TileLayer
            maxNativeZoom={currentLayerDetails.maxNativeZoom}
            url={currentLayerDetails.url}
            attribution={currentLayerDetails.attribution}
            key={currentLayerDetails.name}
            maxZoom={20}
          />
        )}
        {/* zoomcontrol */}
        <ZoomControl theme={theme} />{" "}
        <Control position="bottomleft">
          <div className="bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
            Zoom: {zoom}
          </div>
        </Control>
        <Control position="topleft">
          <FilterControl
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            filter={filter}
            changeFilter={setFilter}
          />
        </Control>
        <Control className="z-[999999]" position="topleft">
          <IconButton
            size="lg"
            onClick={() =>
              setActiveSidePanel(activeSidePanel === "region" ? null : "region")
            }
          >
            <FaLocationDot className="w-5 h-5" />
          </IconButton>
          <SidePanel
            title={t("selectProvince")}
            sndWrapperClass="min-w-[15vw]  absolute left-2 "
            isOpen={activeSidePanel === "region"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={
              <div className="rounded-lg flex flex-col gap-2">
                {Object.entries(PROVINCES).map(([key, province]) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleProvinceChange(key);
                      setActiveSidePanel(null);
                    }}
                    className="text-left px-3 py-2 hover:bg-gray-800/50 rounded-none transition-colors"
                  >
                    {province.name}
                  </button>
                ))}
              </div>
            }
          />
        </Control>
        {/* layerchanger */}
        <TileChanger
          activeSidePanel={activeSidePanel}
          setActiveSidePanel={setActiveSidePanel}
        />
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
        {widgets.bottomsection ? (
          <BottomSection cardsInfoData={bottomSectionData} />
        ) : (
          <div style={{ display: "none" }}></div>
        )}
        {/* lights */}
        {filter.trafficlights && <TrafficLightContainer />}
        {/* signs  */}
        {<SignsContainer isVisible={filter.signs} />}
        {/* settings */}
        <Control position="topleft">
          <IconButton
            size="lg"
            onClick={() =>
              setActiveSidePanel(
                activeSidePanel === "settings" ? null : "settings"
              )
            }
          >
            <Cog8ToothIcon className="w-5 h-5" />
          </IconButton>
          <SidePanel
            title={t("markers")}
            sndWrapperClass="absolute left-full ml-2 no-scrollbar overflow-y-scroll w-[15vw] "
            isOpen={activeSidePanel === "settings"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={
              <div className="p-4 flex flex-col">
                <Typography className="text-sm mb-2 text-white ">
                  {t("settings")}
                </Typography>
                <Checkbox
                  label={
                    <Typography className="text-white ">
                      {t("draggable")}
                    </Typography>
                  }
                  ripple={false}
                  checked={isDraggable}
                  onChange={(e) => setIsDraggable(e.target.checked)}
                />
                <div className="text-sm mb-2"></div>
                <Typography className=" text-sm text-white ">
                  {t("widgets")}
                </Typography>
                <WidgetControl
                  filter={widgets}
                  changeFilter={setWidgets}
                  placement={"right"}
                />
              </div>
            }
          />
        </Control>
        {/* aalarm history */}
        <Control position="topleft">
          <DeviceErrorHistory
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
          />
        </Control>
        {/* Device Management */}
        {isPermitted && (
          <Control position="topleft">
            <DeviceManagement
              refreshHandler={getDataHandler}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
            />
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
        <LanguageSwitcher
          activeSidePanel={activeSidePanel}
          setActiveSidePanel={setActiveSidePanel}
        />
        <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() =>
              setActiveSidePanel(activeSidePanel === "alarms" ? null : "alarms")
            }
          >
            {activeSidePanel === "alarms" ? (
              <TbBell className="w-6 h-6" />
            ) : (
              <TbBellRinging className="w-6 h-6" />
            )}
          </IconButton>
          <SidePanel
            title={t("alarms")}
            wrapperClass="fixed top-5  inline-block text-left"
            isOpen={activeSidePanel === "alarms"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={<CurrentAlarms data={currentAlarms} />}
          />
        </Control>
        <Control position="topleft">
          <IconButton
            size="lg"
            onClick={() => {
              setActiveSidePanel(
                activeSidePanel === "markers" ? null : "markers"
              );
            }}
          >
            <FaRegMap className="w-5 h-5" />
          </IconButton>
          <SidePanel
            title={t("markers")}
            wrapperClass="absolute -top-28  inline-block text-left"
            sndWrapperClass="absolute left-full ml-2 no-scrollbar overflow-y-scroll w-[15vw] "
            isOpen={activeSidePanel === "markers"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={
              <div className="flex rounded-b-lg flex-col p-3 bg-gray-900/80 text-blue-gray-900">
                {["clustered", "clustered_dynamically", "dynamic"].map(
                  (type) => (
                    <Radio
                      key={type}
                      checked={useClusteredMarkers === type}
                      className="checked:bg-white"
                      value={type === useClusteredMarkers}
                      onChange={() => {
                        setUseClusteredMarkers(type);
                        type !== "dynamic" ? getDataHandler() : setMarkers([]);
                      }}
                      label={
                        <Typography className="mr-3 text-white">
                          {t(type)}
                        </Typography>
                      }
                    />
                  )
                )}
              </div>
            }
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
        {useClusteredMarkers === "clustered" ||
        useClusteredMarkers === "clustered_dynamically" ? (
          <ClusteredMarkers
            usePieChartForClusteredMarkers={
              useClusteredMarkers === "clustered_dynamically"
            }
            key={useClusteredMarkers}
            handleMonitorCrossroad={handleMonitorCrossroad}
            handleBoxModalOpen={handleBoxModalOpen}
            handleLightsModalOpen={handleLightsModalOpen}
            handleMarkerDragEnd={handleMarkerDragEnd}
            markers={markers}
            filter={filter}
            isDraggable={isDraggable}
            setMarkers={setMarkers}
            clearMarkers={clearMarkers}
            updateMarkers={updateMarkers}
            changedMarker={changedMarker}
          />
        ) : (
          <DynamicMarkers
            handleMonitorCrossroad={handleMonitorCrossroad}
            handleBoxModalOpen={handleBoxModalOpen}
            handleLightsModalOpen={handleLightsModalOpen}
            handleMarkerDragEnd={handleMarkerDragEnd}
            markers={markers}
            filter={filter}
            isDraggable={isDraggable}
            setMarkers={setMarkers}
            clearMarkers={clearMarkers}
            updateMarkers={updateMarkers}
          />
        )}
      </MapContainer>
      <MapModals
        crossroadModal={{ isOpen: isbigMonitorOpen, marker: activeMarker }}
        isBoxLoading={isBoxLoading}
        deviceModal={{ isOpen: isBoxModalOpen, device: activeBox }}
        isLightsLoading={isLightsLoading}
        trafficLightsModal={{ isOpen: isLightsModalOpen, light: activeLight }}
        onClose={{
          crossroad: handleCloseCrossroadModal,
          device: handleCloseDeviceModal,
          trafficLights: handleCloseTrafficLightsModal,
        }}
      />
    </>
  );
};

MapComponent.propTypes = {
  changedMarker: PropTypes.object,
};

export default MapComponent;
