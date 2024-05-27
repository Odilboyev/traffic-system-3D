import { XCircleIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import ModalCharts from "./subPages/chart";
import Videos from "./subPages/videos";
import { useEffect, useState } from "react";
import {
  getBoxData,
  getCrossRoadChart,
  getCrossRoadData,
} from "../../../../apiHandlers";
import FullscreenBox from "./components/fullscreen";
import SensorSection from "./subPages/sensor";
import { format } from "date-fns";
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
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartDate, setChartDate] = useState(new Date().toJSON().split("T")[0]);
  const [interval, setInterval] = useState(60);
  const handleDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setChartDate(formattedDate);
  };
  const getData = async (id) => {
    try {
      const res = await getCrossRoadData(id);
      setData(res?.data);
    } catch (error) {
      throw new Error(error);
    }
  };
  const getSensorData = async (id) => {
    try {
      const res = await getBoxData(id);
      setDevice({
        device_data: res?.device_data,
        sensor_data: res?.sensor_data,
      });
    } catch (error) {
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
    console.log(marker?.cid);
    console.log(data);
    if (open && marker && data === null) {
      getData(marker?.cid);
      getChartData();
    }
    if (data && device === null) getSensorData(data?.box_device?.id);
    return () => {};
  }, [open, data, marker]);
  useEffect(() => {
    open && getData(marker?.cid);
    return () => {};
  }, [marker]);

  useEffect(() => {
    open && getChartData();
    return () => {};
  }, [chartDate, interval]);

  const handleClose = () => {
    setData(null);
    handleOpen();
  };
  return (
    <Dialog size="xxl" open={open} handler={handleClose}>
      <DialogHeader className="justify-between p-2">
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
      <DialogBody className="h-[90vh] overflow-auto py-0">
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
          <div className={"row-span-2 max-h-full overflow-y-scroll"}>
            <Videos videos={data?.camera} />
          </div>

          <FullscreenBox>
            {device && <SensorSection device={device} isLoading={isLoading} />}
          </FullscreenBox>
          <FullscreenBox>
            {chartData && chartData?.length > 0 && (
              <ModalCharts
                directions={chartData}
                interval={interval}
                handleInterval={setInterval}
                time={chartDate}
                handleTime={handleDate}
              />
            )}
          </FullscreenBox>
        </div>
      </DialogBody>
    </Dialog>
  );
};
export default MonitoringModal;
