import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
  CardBody,
  Card,
  Spinner,
} from "@material-tailwind/react";
import SensorCard from "./sensorCard";
import Loader from "../../../loader";
import Chart from "react-apexcharts";

import { useEffect, useState } from "react";
import {
  getBoxSensorChart,
  getErrorHistory,
} from "../../../../api/api.handlers";
import moment from "moment";
import { useTheme } from "../../../../customHooks/useTheme";
import { t } from "i18next";

const DeviceModal = ({ device, isDialogOpen, handler, isLoading }) => {
  const { theme } = useTheme();
  const { device_data = {}, sensor_data = {} } = device || {};
  const [chartData, setChartData] = useState(null);
  const [selectedSensorId, setSelectedSensorId] = useState(null);
  const [errorHistory, setErrorHistory] = useState([]);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const getChartData = async (sensor) => {
    try {
      const res = await getBoxSensorChart(device_data?.id, sensor);
      const seriesData = res.data.map((item) => ({
        x: item.datetime,
        y: parseFloat(item.sensor_value),
      }));
      setChartData([
        {
          name: "Sensor Value",
          data: seriesData,
        },
      ]);
      setSelectedSensorId(sensor);
    } catch (error) {
      throw new Error(error);
    }
  };

  const fetchErrorHistory = async (sensor_id) => {
    const data = {
      type: 3,
      device_id: device_data.id,
      sensor_id: sensor_id,
    };
    try {
      const res = await getErrorHistory(1, data);
      setErrorHistory(res.data);
    } catch (error) {
      console.error("Error fetching error history:", error);
    }
  };

  useEffect(() => {
    if (sensor_data && sensor_data?.length > 0) {
      getChartData(sensor_data[0].sensor_id);
    }
  }, [sensor_data]);

  useEffect(() => {
    if (errorHistory?.length > 0) {
      const sorted = sortData(errorHistory, sortedColumn, sortOrder);

      setFilteredData(sorted);
    }
  }, [errorHistory, sortedColumn, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHeader = (keyName) => {
    if (sortedColumn === keyName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedColumn(keyName);
    }
  };

  const sortData = (errorHistory, sortedColumn, sortOrder) => {
    return [...errorHistory].sort((a, b) => {
      const valueA = a[sortedColumn];
      const valueB = b[sortedColumn];

      if (typeof valueA === "undefined" || typeof valueB === "undefined") {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return sortOrder === "asc"
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
    });
  };

  let tableHeaders =
    errorHistory?.length > 0 ? Object.keys(errorHistory[0]) : [];

  return (
    <Dialog
      size="xxl"
      open={isDialogOpen}
      handler={handler}
      className="dark:bg-blue-gray-900 dark:text-white"
    >
      <DialogHeader className="justify-end ">
        <IconButton size="sm" variant="text" onClick={handler}>
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

      <DialogBody className="overflow-y-scroll flex gap-2 max-h-[90vh] no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : device_data ? (
          <>
            <Card className="dark:bg-blue-gray-900 dark:text-white border basis-1/6 row-span-2 col-span-1 rounded-none border-none">
              <CardBody className="flex w-full flex-col justify-between gap-2">
                <div className="flex flex-col">
                  <span>ID</span>
                  <Typography className="font-bold">
                    {device_data?.name}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <span>Seriya raqami</span>
                  <Typography className="font-bold">
                    {device_data?.sn}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <span>Obyekt nomi</span>
                  <Typography className="font-bold">
                    {device_data?.adres}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <span>Mas'ul xodim</span>
                  <Typography className="font-bold">
                    {device_data?.masul_hodim}
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <span>Xodim telefon raqami</span>
                  <Typography className="font-bold">
                    {device_data?.phone
                      ? device_data.phone
                      : "Raqam mavjud emas"}
                  </Typography>
                </div>
              </CardBody>
            </Card>
            <div
              className={`dark:text-white border-none basis-5/6 col-span-4 shadow-none overflow-y-auto text-center ${
                (sensor_data && sensor_data.length === 0) ||
                chartData?.length === 0 ||
                (chartData == null && "row-span-2")
              }`}
            >
              <div className="justify-around grid grid-cols-9 gap-3  text-center w-full">
                {sensor_data && sensor_data.length > 0 ? (
                  sensor_data.map((v, i) => (
                    <SensorCard
                      {...v}
                      key={i}
                      active={selectedSensorId == v.sensor_id}
                      handler={(sensorId) => {
                        sensorId == 2 || sensorId == 3 || sensorId == 16
                          ? getChartData(sensorId)
                          : null;
                        setSelectedSensorId(sensorId);
                        fetchErrorHistory(sensorId);
                      }}
                    />
                  ))
                ) : (
                  <Card className="border-none basis-3/4 shadow-none overflow-y-auto">
                    <Typography>No sensors</Typography>
                  </Card>
                )}
              </div>
              {sensor_data &&
              sensor_data.length > 0 &&
              selectedSensorId &&
              [2, 3, 16].includes(selectedSensorId) ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="no-scrollbar dark:text-white overflow-y-auto ">
                    <Chart
                      options={getChartOptions(theme == "dark")}
                      series={chartData}
                      width={"100%"}
                      type="area"
                    />
                  </div>
                  <div className="overflow-x-scroll no-scrollbar">
                    <table className="w-full table-auto overflow-x-scroll border border-slate-400">
                      <thead className="text-left">
                        <tr className="font-bold">
                          {tableHeaders.map((key, i) => (
                            <th
                              className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white cursor-pointer"
                              key={i}
                              onClick={() => handleHeader(key)}
                            >
                              <div className="flex justify-between gap-4 items-center">
                                <Typography className="font-bold">
                                  {t(key)}
                                </Typography>
                                {sortedColumn === key && (
                                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="overflow-x-scroll font-bold">
                        {filteredData.map((item, i) => (
                          <tr
                            key={i}
                            // onClick={() => (itemCallback ? historyHandler(item) : {})}
                            className={`dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                          >
                            {tableHeaders.map((key, index) => (
                              <td
                                key={index}
                                className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                                  key === "statuserror" &&
                                  getRowColor(item[key])
                                }`}
                              >
                                <Typography>
                                  {key === "duration"
                                    ? moment
                                        .utc(item[key] * 1000)
                                        .format("HH:mm:ss")
                                    : key === "statuserror"
                                    ? item["statuserror_name"]
                                    : item[key]}
                                </Typography>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedSensorId ? (
                <div className="p-4 dark:text-white overflow-y-auto">
                  {errorHistory?.length > 0 ? (
                    <table className="w-full table-auto overflow-x-scroll border border-slate-400">
                      <thead className="text-left">
                        <tr className="font-bold">
                          {tableHeaders.map((key, i) => (
                            <th
                              className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white cursor-pointer"
                              key={i}
                              onClick={() => handleHeader(key)}
                            >
                              <div className="flex justify-between gap-4 items-center">
                                <Typography className="font-bold">
                                  {t(key)}
                                </Typography>
                                {sortedColumn === key && (
                                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="overflow-x-scroll font-bold">
                        {filteredData.map((item, i) => (
                          <tr
                            key={i}
                            // onClick={() => (itemCallback ? historyHandler(item) : {})}
                            className={`dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                          >
                            {tableHeaders.map((key, index) => (
                              <td
                                key={index}
                                className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                                  key === "statuserror" &&
                                  getRowColor(item[key])
                                }`}
                              >
                                <Typography>
                                  {key === "duration"
                                    ? moment
                                        .utc(item[key] * 1000)
                                        .format("HH:mm:ss")
                                    : key === "statuserror"
                                    ? item["statuserror_name"]
                                    : item[key]}
                                </Typography>
                              </td>
                            ))}{" "}
                            {/* <Pagination
                          totalItems={totalItems}
                          currentPage={currentPage}
                          totalPages={totalPages ? totalPages : 0}
                          onPageChange={handlePageChange}
                        /> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <Typography className="">No data available</Typography>
                  )}
                </div>
              ) : (
                <Card className="dark:bg-blue-gray-800 dark:text-white border-none col-span-4 shadow-none overflow-y-auto">
                  <Typography>No Data Available</Typography>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Typography>No device data</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default DeviceModal;
const getChartOptions = (isDarkMode = false) => ({
  chart: {
    height: 350,
    stacked: false,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    background: isDarkMode ? "#1F2937" : "#FFFFFF",
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: isDarkMode ? "#E5E7EB" : "#1F2937",
    },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: "12px",
      colors: [isDarkMode ? "#E5E7EB" : "#1F2937"], // Colors for data labels
    },
    formatter: function (val) {
      return val.toLocaleString(); // Format numbers with commas
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
    colors: isDarkMode
      ? ["#ff8c00", "#FF4500"] // Two distinct colors for "Today" and "Yesterday" in dark mode
      : ["#0066CC", "#FF8C00"], // Two distinct colors for "Today" and "Yesterday" in light mode
  },
  fill: {
    opacity: 0.7,
    colors: isDarkMode
      ? ["#FF8C00", "#FF4500"] // Fill colors for dark mode
      : ["#0066CC", "#FF8C00"], // Fill colors for light mode
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
            colors: [isDarkMode ? "#E5E7EB" : "#1F2937"],
          },
        },
      },
    },
  },
  xaxis: {
    type: "category",
    labels: {
      format: "HH:mm",
      rotate: -45,
      tickPlacement: "on",
      style: {
        colors: isDarkMode ? "#E5E7EB" : "#1F2937",
      },
    },
  },
  yaxis: {
    labels: {
      minWidth: 40,
      style: {
        colors: isDarkMode ? "#E5E7EB" : "#1F2937",
      },
    },
  },
  theme: {
    mode: isDarkMode ? "dark" : "light",
  },
});
const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return "bg-green-100 text-center dark:bg-green-900 dark:text-white";
    case 1:
      return "bg-orange-100 text-center dark:bg-orange-900 dark:text-white";
    case 2:
      return "bg-red-100 text-center dark:bg-red-900 dark:text-white";
    case 3:
      return "bg-blue-gray-100 text-gray-900 text-center dark:bg-blue-gray-700 dark:text-white";
    default:
      return "bg-white text-center dark:bg-blue-gray-900 dark:text-white";
  }
};
