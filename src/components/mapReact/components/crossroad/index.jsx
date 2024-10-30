import { XMarkIcon } from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import ModalCharts from "./subPages/chart";
import Videos from "./subPages/videos";
import { useEffect, useState } from "react";
import {
  getBoxData,
  getCrossRoadChart,
  getCrossRoadData,
  getTrafficLightsData,
} from "../../../../api/api.handlers";
import FullscreenBox from "./components/fullscreen";
// import SensorSection from "./subPages/sensor";
import { format } from "date-fns";
import TrafficLights from "../trafficLights";
import Svetoforlar from "../svetofor";
import { MapContainer, TileLayer } from "react-leaflet";
import { useTheme } from "../../../../customHooks/useTheme";
import baseLayers from "../../../../configurations/mapLayers";
import Loader from "../../../loader";
import { TbLoader } from "react-icons/tb";
import CrossroadDashboard from "./subPages/crossroadDash";
import TrafficLightContainer from "../svetofor/managementLights";
import SensorSection from "../sensorSection";
import SensorPartWrapper from "../sensorSection/wrapper";
import ZoomControl from "../controls/customZoomControl";

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

const CrossroadModal = ({ open, handleOpen, marker }) => {
  const { theme } = useTheme();
  const currentLayer = baseLayers.find(
    (layer) => layer.name === localStorage.getItem("selectedLayer")
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isChartLoading, setChartLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const crossroadData = await getCrossRoadData(id);
      setData(crossroadData?.data);
      fetchTrafficLights(crossroadData?.data?.svetofor?.svetofor_id);
    } catch (error) {
      console.error("Failed to fetch crossroad data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrafficLights = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const trafficLightsData = await getTrafficLightsData(id);
      setTrafficLights(trafficLightsData);
    } catch (error) {
      console.error("Failed to fetch traffic lights data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSensorData = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const sensorData = await getBoxData(id);
      setDevice({
        device_data: sensorData?.device_data,
        sensor_data: sensorData?.sensor_data,
      });
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartData = async () => {
    setChartLoading(true);
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
      setChartLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      if (!data) fetchData(marker?.cid);
      if (data && !device && data?.box_device) {
        fetchSensorData(data.box_device?.id);
      }
    }
    return () => {};
  }, [open, data]);

  useEffect(() => {
    if (open) fetchChartData();
    return () => setChartData(null);
  }, [chartDate, interval]);

  const handleClose = () => {
    setData(null);
    setDevice(null);
    setChartData(null);
    setTrafficLights(null);
    handleOpen();
  };

  return (
    <Dialog
      size="xxl"
      className="dark:!bg-blue-gray-800 dark:text-white"
      open={open}
      handler={handleClose}
    >
      <DialogHeader className="justify-between p-2 dark:!bg-blue-gray-900 dark:text-white">
        <Typography className="text-2xl font-bold">{marker?.cname}</Typography>
        <IconButton
          className="m-1"
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleOpen}
          aria-label="Close dialog"
        >
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="h-[90vh] overflow-auto py-0 dark:bg-blue-gray-900 no-scrollbar">
        <div className="grid grid-cols-2 grid-rows-2 h-full">
          <FullscreenBox>
            <Videos videos={data?.camera} />
          </FullscreenBox>
          <FullscreenBox>
            <div className="overflow-y-scroll no-scrollbar">
              {device ? (
                <SensorPartWrapper device={device} isInCrossroad={true} />
              ) : (
                <Typography>No Sensor data</Typography>
              )}
            </div>
          </FullscreenBox>
          <FullscreenBox>
            <div className="h-full w-full">
              <TrafficLights id={marker?.cid} isInModal={true} />
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
            <CrossroadDashboard marker={marker} />
          </FullscreenBox>
        </div>
      </DialogBody>
    </Dialog>
  );
};

CrossroadModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  marker: PropTypes.shape({
    cid: PropTypes.number,
    cname: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default CrossroadModal;
