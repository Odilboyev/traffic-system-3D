import { Typography, CardBody, Card } from "@material-tailwind/react";
// import Loader from "./Loader";
import Chart from "react-apexcharts";

import { useEffect, useState } from "react";
import SensorTable from "../components/sensortable";
import Loader from "../../../../Loader";
import { getBoxSensorChart } from "../../../../../apiHandlers";

const SensorSection = ({ device, isLoading }) => {
  const { device_data, sensor_data } = device;

  const [chartData, setChartData] = useState(null);
  const getChartData = async (sensor) => {
    try {
      const res = await getBoxSensorChart(device_data.id, sensor.sensor_id);
      const seriesData = res.data.map((item) => ({
        x: item.datetime,
        y: parseFloat(item.sensor_value),
      }));
      console.log(seriesData);
      seriesData.length > 0 &&
        setChartData([
          {
            name: sensor.sensor_name,
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
  }, [open, sensor_data]);

  return (
    <>
      <div className=" grid  grid-cols-5 grid-rows-2 h-full">
        {!isLoading ? (
          <>
            <div className="border col-span-1 rounded-none border-none ">
              <CardBody className="flex w-full flex-col justify-between gap-2 max-h-full overflow-y-auto">
                <div className="flex flex-col">
                  <span>ID</span>
                  <Typography color="blue-gray" className="font-bold">
                    {device_data?.name}
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
            </div>
            <div
              className={`border-none col-span-4 shadow-none overflow-y-auto  text-center ${
                (device && sensor_data && sensor_data.length === 0) ||
                chartData?.length === 0 ||
                (chartData == null && "row-span-2")
              }`}
            >
              <div className={`w-full h-full col-span-4`}>
                {device && sensor_data && sensor_data.length > 0 ? (
                  <SensorTable data={sensor_data} handler={getChartData} />
                ) : (
                  <Card className="border-none basis-3/4 shadow-none overflow-y-auto">
                    <Typography>No sensors</Typography>
                  </Card>
                )}
              </div>
            </div>
            {device &&
              sensor_data &&
              sensor_data.length > 0 &&
              chartData &&
              chartData.length > 0 && (
                <Card className="border-none col-span-5 m-0 shadow-none ">
                  <Chart
                    options={chartOptions}
                    series={chartData}
                    width={"100%"}
                    height={"90%"}
                    type="area"
                  />
                </Card>
              )}
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        )}
      </div>
    </>
  );
};

export default SensorSection;
const chartOptions = {
  chart: {
    type: "area",
    stacked: false,
  },
  colors: ["#0bd500"],
  stroke: {
    curve: "monotoneCubic",
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
