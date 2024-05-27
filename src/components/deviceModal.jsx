import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
  Switch,
  Button,
  CardBody,
  Card,
  Spinner,
} from "@material-tailwind/react";
import SensorCard from "./sensorCard";
import Loader from "./Loader";
import Chart from "react-apexcharts";

import { useEffect, useState } from "react";
import { getBoxSensorChart } from "../apiHandlers";

const DeviceModal = ({ device, isDialogOpen, handler, isLoading }) => {
  const { device_data, sensor_data } = device | {};

  const [chartData, setChartData] = useState(null);
  const getChartData = async (sensor) => {
    try {
      const res = await getBoxSensorChart(device_data?.id, sensor);
      const seriesData = res.data.map((item) => ({
        x: item.datetime,
        y: parseFloat(item.sensor_value),
      }));
      console.log(seriesData);
      seriesData.length > 0 &&
        setChartData([
          {
            name: "Sensor Value",
            data: seriesData,
          },
        ]);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    open &&
      sensor_data &&
      sensor_data.length > 0 &&
      getChartData(sensor_data[0].sensor_id);
    return () => {};
  }, [open]);

  return (
    <Dialog size="xxl" open={isDialogOpen} handler={handler}>
      <DialogHeader className="justify-between">
        <div>
          {/* <Typography variant="h5" color="blue-gray">
            {!isLoading && device_data?.name}
          </Typography> */}
        </div>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-scroll grid  grid-cols-5 grid-rows-2   gap-2 max-h-[90vh]">
        {!isLoading ? (
          device_data ? (
            <>
              <Card className="border basis-1/4 row-span-2 col-span-1 rounded-none border-none ">
                <CardBody className="flex w-full flex-col justify-between gap-2">
                  <div className="flex flex-col">
                    <span>ID</span>
                    <Typography color="blue-gray" className="font-bold">
                      {device_data?.name}
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <span>Seriya raqami</span>
                    <Typography color="blue-gray" className="font-bold">
                      {device_data?.sn}
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <span>Obyekt nomi</span>
                    <Typography color="blue-gray" className="font-bold">
                      {device_data?.adres}
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <span>Mas'ul xodim</span>
                    <Typography color="blue-gray" className="font-bold">
                      {device_data?.masul_hodim}
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <span>Xodim telefon raqami</span>
                    <Typography color="blue-gray" className="font-bold">
                      {device_data?.phone
                        ? device_data.phone
                        : "Raqam mavjud emas"}
                    </Typography>
                  </div>
                </CardBody>
              </Card>
              <Card
                className={`border-none basis-3/4 col-span-4 shadow-none overflow-y-auto text-center ${
                  (device && sensor_data && sensor_data.length === 0) ||
                  chartData?.length === 0 ||
                  (chartData == null && "row-span-2")
                }`}
              >
                <CardBody className={`w-full h-full col-span-4`}>
                  <div
                    className={`grid grid-cols-[repeat(auto-fill,10rem)] gap-4 justify-around text-center w-full`}
                  >
                    {device && sensor_data && sensor_data.length > 0 ? (
                      sensor_data.map((v, i) => (
                        <SensorCard {...v} key={i} handler={getChartData} />
                      ))
                    ) : (
                      <Card className="border-none basis-3/4 shadow-none overflow-y-auto">
                        <Typography>No sensors</Typography>
                      </Card>
                    )}
                  </div>
                </CardBody>
              </Card>
              {device &&
                sensor_data &&
                sensor_data.length > 0 &&
                chartData &&
                chartData.length > 0 && (
                  <Card className="border-none col-span-2 shadow-none overflow-y-auto border-top border border-red-50">
                    <div className="w-full">
                      <Chart
                        options={chartOptions}
                        series={chartData}
                        width={"80%"}
                        type="area"
                      />
                    </div>
                  </Card>
                )}
            </>
          ) : (
            <Typography>No data</Typography>
          )
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default DeviceModal;
const chartOptions = {
  chart: {
    type: "area",
    height: 350,
    stacked: false,
  },
  colors: ["#0bd500"],
  stroke: {
    // curve: "monotoneCubic",
    width: 0.8,
  },
  dataLabels: {
    enabled: false, // <--- HERE
  },
  fill: {
    type: "gradient",

    gradient: {
      opacityFrom: 0.8,
      opacityTo: 0.4,
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  xaxis: {
    type: "datetime",
  },
};
