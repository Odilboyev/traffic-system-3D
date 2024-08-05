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
} from "../../../../apiHandlers";
import FullscreenBox from "./components/fullscreen";
import SensorSection from "./subPages/sensor";
import { format } from "date-fns";
import LightsOnMap from "./subPages/lightsOnMap";
import TrafficLights from "../trafficLights";
function transformDataForCharts(data) {
  const transformed = data.map((direction) => {
    const series = [
      { name: "carall", data: [], type: "line" },
      { name: "carmid", data: [], type: "column" },
      { name: "carbig", data: [], type: "column" },
      { name: "carsmall", data: [], type: "column" },
      // Add more series for other car types if needed
    ];

    direction.data.forEach((item) => {
      const { date, carall, carmid, carbig, carsmall } = item;
      const x = date;

      series[0].data.push({ x, y: carall });
      series[1].data.push({ x, y: carmid });
      series[2].data.push({ x, y: carbig });
      series[3].data.push({ x, y: carsmall });
      // Push data for other car types to their respective series
    });

    return { directionName: direction.direction_name, series };
  });

  return transformed;
}

const MonitoringModal = ({ open, handleOpen, marker }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState(null);

  const [trafficLights, setTrafficLights] = useState(null);
  const [trafficSocketData, setTrafficSocketData] = useState(null);

  const [chartData, setChartData] = useState(null);
  const [chartDate, setChartDate] = useState(new Date().toJSON().split("T")[0]);
  const [interval, setInterval] = useState(60);

  const [device, setDevice] = useState(null);

  const handleDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setChartDate(formattedDate);
  };
  const getData = async (id) => {
    setIsLoading(true);
    try {
      const res = await getCrossRoadData(id);
      setIsLoading(false);

      setData(res?.data);
      getTrafficLights(res?.data.svetofor.svetofor_id);
    } catch (error) {
      setIsLoading(false);

      throw new Error(error);
    }
  };
  const getTrafficLights = async (id) => {
    setIsLoading(true);
    try {
      const res = await getTrafficLightsData(id);
      setIsLoading(false);
      console.log(res, "traffic");
      setTrafficLights(res);
    } catch (error) {
      setIsLoading(false);

      throw new Error(error);
    }
  };

  const onTrafficLightsDataReceived = (data) => {
    // console.log(data, "traffic with socket");
    // console.log(trafficSocketData, "old traffic data");
    setTrafficSocketData((light) => {
      return data?.channel.map((v) => {
        return {
          ...v,
          lat: trafficLights.find((light) => v.id === light.link_id).lat,
          lng: trafficLights.find((light) => v.id === light.link_id).lng,
          rotate: trafficLights.find((light) => v.id === light.link_id).rotate,
          type: trafficLights.find((light) => v.id === light.link_id).type,
        };
      });
    });
  };
  useEffect(() => {
    let trafficSocket;
    if (open && trafficLights) {
      trafficSocket = new WebSocket(
        import.meta.env.VITE_TRAFFIC_SOCKET + data?.svetofor.svetofor_id
      );
      trafficSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onTrafficLightsDataReceived(data);
      };
    }

    return () => {
      // Clean up the socket connection when the dialog is closed
      if (trafficSocket) {
        trafficSocket.close();
      }
    };
  }, [open, trafficLights]);

  const getSensorData = async (id) => {
    setIsLoading(true);

    try {
      const res = await getBoxData(id);
      setIsLoading(false);

      setDevice({
        device_data: res?.device_data,
        sensor_data: res?.sensor_data,
      });
    } catch (error) {
      setIsLoading(false);

      throw new Error(error);
    }
  };

  const req = {
    crossroad_id: marker?.cid,
    date: chartDate,
    interval: interval,
  };

  const getChartData = async () => {
    try {
      const res = await getCrossRoadChart(req);

      const transformedData = transformDataForCharts(res.direction_data);

      if (transformedData.length > 0) {
        setChartData(transformedData);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    if (open && data === null) {
      getData(marker?.cid);
    }
    if (data && device === null && data?.box_device) {
      getSensorData(data.box_device?.id);
    }
    return () => {};
  }, [open, data]);

  useEffect(() => {
    open && getChartData();
    return () => {
      setChartData(null);
    };
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
      className="dark:!bg-blue-gray-800 "
      open={open}
      handler={handleClose}
    >
      <DialogHeader className="justify-between p-2 dark:!bg-blue-gray-900">
        <div>{marker?.cname}</div>
        <IconButton
          className="m-1"
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={() => handleOpen()}
        >
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="h-[90vh] overflow-auto py-0 dark:bg-blue-gray-900">
        something iowgblehrgui
        <div className="grid grid-cols-2 grid-rows-2 h-full">
          <div className={"max-h-full overflow-y-scroll border p-2"}>
            <Videos videos={data?.camera} />
          </div>
          {/* sensors */}
          <FullscreenBox>
            {device ? (
              <SensorSection
                key={marker?.cid}
                device={device}
                isLoading={isLoading}
                markerId={marker?.cid}
              />
            ) : (
              <Typography>No Sensor data</Typography>
            )}
          </FullscreenBox>{" "}
          {/* traffic lights */}
          <FullscreenBox>
            <TrafficLights
              open={open}
              lightsId={data?.svetofor.svetofor_id}
              lights={trafficLights}
              lightsSocketData={trafficSocketData}
              center={[marker?.lat, marker?.lng]}
            />
            {/* <TrafficLights /> */}
            {/* ) : (
              <Typography>No traffic lights here</Typography>
           */}
          </FullscreenBox>
          {/* chart data for the number of cars */}
          <FullscreenBox>
            {chartData && chartData?.length > 0 ? (
              <ModalCharts
                directions={chartData}
                interval={interval}
                handleInterval={setInterval}
                time={chartDate}
                handleTime={handleDate}
              />
            ) : (
              <Typography> No Chart Data</Typography>
            )}
          </FullscreenBox>
        </div>
      </DialogBody>
    </Dialog>
  );
};

MonitoringModal.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  marker: PropTypes.any,
};
export default MonitoringModal;
