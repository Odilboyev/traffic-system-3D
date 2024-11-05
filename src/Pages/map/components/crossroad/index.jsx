import { XMarkIcon } from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  getBoxData,
  getCrossRoadChart,
  getCrossRoadData,
  getTrafficLightsData,
} from "../../../../api/api.handlers";
import FullscreenBox from "./components/fullscreen";
import Videos from "./subPages/videos";
// import SensorSection from "./subPages/sensor";
import { format } from "date-fns";
import Loader from "../../../../components/loader";
import baseLayers from "../../../../configurations/mapLayers";
import { useTheme } from "../../../../customHooks/useTheme";
import SensorPartWrapper from "../deviceModal/components/sensorSection/wrapper";
import TrafficLightDashboard from "../trafficLightsModal/components/trafficLightDashboard";
import CrossroadDashboard from "./subPages/crossroadDash";

// Helper function to transform chart data
function transformDataForCharts(data) {
  return data.map((direction) => {
    const series = [
      { name: "carmid", data: [] },
      { name: "carbig", data: [] },
      { name: "carsmall", data: [] },
    ];

    direction.data.forEach((item) => {
      const { date, carmid, carbig, carsmall } = item;
      series[0].data.push({ x: date, y: carmid });
      series[1].data.push({ x: date, y: carbig });
      series[2].data.push({ x: date, y: carsmall });
    });

    return { directionName: direction.direction_name, series };
  });
}

const CrossroadModal = ({ isOpen, onClose, marker }) => {
  const { theme } = useTheme();
  const currentLayer = baseLayers.find(
    (layer) => layer.name === localStorage.getItem("selectedLayer")
  );

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [data, setData] = useState(null);
  const [trafficLights, setTrafficLights] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartDate, setChartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [interval, setInterval] = useState(60);
  const [device, setDevice] = useState(null);

  const handleDate = (date) => {
    setChartDate(format(date, "yyyy-MM-dd"));
  };

  const fetchData = async (id) => {
    setIsVideoLoading(true);
    try {
      const crossroadData = await getCrossRoadData(id);
      setData(crossroadData?.data);
      fetchTrafficLights(crossroadData?.data?.svetofor?.svetofor_id);
    } catch (error) {
      console.error("Failed to fetch crossroad data:", error);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const fetchTrafficLights = async (id) => {
    if (!id) return;
    try {
      const trafficLightsData = await getTrafficLightsData(id);
      setTrafficLights(trafficLightsData);
    } catch (error) {
      console.error("Failed to fetch traffic lights data:", error);
    }
  };

  const fetchSensorData = async (id) => {
    if (!id) return;
    setIsDeviceLoading(true);
    try {
      const sensorData = await getBoxData(id);
      setDevice({
        device_data: sensorData?.device_data,
        sensor_data: sensorData?.sensor_data,
      });
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    } finally {
      setIsDeviceLoading(false);
    }
  };

  const fetchChartData = async () => {
    setIsChartLoading(true);
    try {
      const res = await getCrossRoadChart({
        crossroad_id: marker?.cid,
        date: chartDate,
        interval: interval,
      });
      const transformedData = transformDataForCharts(res.direction_data);
      setChartData(transformedData.length > 0 ? transformedData : null);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && marker?.cid) {
      setData(null);
      setDevice(null);
      fetchData(marker.cid);
    }
  }, [isOpen, marker]);

  useEffect(() => {
    if (data?.box_device?.id) {
      fetchSensorData(data.box_device.id);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) fetchChartData();
    return () => setChartData(null);
  }, [chartDate, interval]);

  const handleClose = () => {
    setData(null);
    setDevice(null);
    setChartData(null);
    setTrafficLights(null);
    onClose();
  };
  return (
    <Dialog
      size="xxl"
      className="dark:!bg-blue-gray-800 dark:text-white"
      open={isOpen}
      handler={handleClose}
    >
      <DialogHeader className="justify-between p-2 dark:!bg-blue-gray-900 dark:text-white">
        <Typography className="text-2xl font-bold">{marker?.cname}</Typography>
        <IconButton
          className="m-1"
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="h-[90vh] overflow-auto py-0 dark:bg-blue-gray-900 no-scrollbar">
        <div className="grid grid-cols-2 grid-rows-2 h-full">
          <FullscreenBox>
            {isVideoLoading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Loader minHeight="10vh" />
              </div>
            ) : (
              <Videos videos={data?.camera} />
            )}
          </FullscreenBox>
          <FullscreenBox>
            <div className="overflow-y-scroll no-scrollbar">
              {isDeviceLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                  <Loader />
                </div>
              ) : device ? (
                <SensorPartWrapper
                  device={device}
                  isInCrossroad={true}
                  isLoading={isDeviceLoading}
                />
              ) : (
                <Typography>No Sensor data</Typography>
              )}
            </div>
          </FullscreenBox>
          <FullscreenBox>
            <div className="h-full w-full">
              <TrafficLightDashboard id={marker?.cid} isInModal={true} />
            </div>
            {/* <MapContainer
              id="monitoring"
              attributionControl={false}
              center={[Number(marker?.lat), Number(marker?.lng)]}
              zoom={20}
              zoomControl={false}
              zoomDelta={0.6}
              style={{ height: "100%", width: "100%" }}
            >
              <ZoomControl theme={theme} position={"bottomleft"} />{" "}
              {currentLayer && (
                <TileLayer
                  maxNativeZoom={currentLayer.maxNativeZoom}
                  url={currentLayer.url}
                  attribution={currentLayer.attribution}
                  key={currentLayer.name}
                  maxZoom={22}
                />
              )}
              <TrafficLightContainer isInModal={true} />
            </MapContainer> */}
          </FullscreenBox>
          <FullscreenBox>
            {isChartLoading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Loader />
              </div>
            ) : (
              <CrossroadDashboard marker={marker} />
            )}
          </FullscreenBox>
        </div>
      </DialogBody>
    </Dialog>
  );
};

CrossroadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  marker: PropTypes.object,
};

export default CrossroadModal;
