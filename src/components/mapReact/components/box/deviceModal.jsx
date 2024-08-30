import { useEffect, useState } from "react";
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
import moment from "moment";
import { useTheme } from "../../../../customHooks/useTheme";
import { t } from "i18next";
import {
  getBoxSensorChart,
  getErrorHistory,
} from "../../../../api/api.handlers";
import getRowColor from "../../../../configurations/getRowColor";

const hiddenCols = ["type", "type_name", "device_id"];

// Custom hook for fetching and sorting data
const useErrorHistory = (deviceId, sensorId, sortedColumn, sortOrder) => {
  const [errorHistory, setErrorHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (sensorId) {
      fetchErrorHistory(sensorId);
    }
  }, [sensorId]);

  useEffect(() => {
    if (errorHistory?.length > 0) {
      const sorted = sortData(errorHistory, sortedColumn, sortOrder);
      setFilteredData(sorted);
    }
  }, [errorHistory, sortedColumn, sortOrder]);

  const fetchErrorHistory = async (sensorId) => {
    try {
      const data = { type: 3, device_id: deviceId, sensor_id: sensorId };
      const res = await getErrorHistory(1, data);
      setErrorHistory(res.data);
    } catch (error) {
      console.error("Error fetching error history:", error);
    }
  };

  const sortData = (data, column, order) => {
    return [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (typeof valueA === "undefined" || typeof valueB === "undefined") {
        return order === "asc" ? -1 : 1;
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return order === "asc"
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
    });
  };

  return { errorHistory, filteredData };
};

const DeviceModal = ({ device, isDialogOpen, handler, isLoading }) => {
  const { theme } = useTheme();
  const { device_data = {}, sensor_data = [] } = device || {};
  const [chartData, setChartData] = useState(null);
  const [selectedSensorId, setSelectedSensorId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { errorHistory, filteredData } = useErrorHistory(
    device_data?.id,
    selectedSensorId,
    sortedColumn,
    sortOrder
  );

  useEffect(() => {
    if (sensor_data?.length > 0) {
      handleSensorSelection(sensor_data[0].sensor_id);
    }
  }, [sensor_data]);

  const handleSensorSelection = async (sensorId) => {
    if ([2, 3, 16].includes(sensorId)) {
      await fetchChartData(sensorId);
    } else {
      setChartData(null); // Clear chart data if sensorId is not allowed
    }
    setSelectedSensorId(sensorId);
  };

  const fetchChartData = async (sensorId) => {
    try {
      const res = await getBoxSensorChart(device_data?.id, sensorId);
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
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleSort = (keyName) => {
    if (sortedColumn === keyName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedColumn(keyName);
    }
  };

  const renderTableHeaders = () => (
    <tr className="font-bold">
      {errorHistory &&
        Object.keys(errorHistory[0] || {})?.map((key, index) =>
          hiddenCols.includes(key) ? null : (
            <th
              key={index}
              className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white cursor-pointer"
              onClick={() => handleSort(key)}
            >
              <div className="flex justify-between gap-4 items-center">
                <Typography className="font-bold">{t(key)}</Typography>
                {sortedColumn === key && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
          )
        )}
    </tr>
  );

  const renderTableRows = () =>
    filteredData.map((item, i) => (
      <tr
        key={i}
        className={`dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
      >
        {Object.keys(item).map((key, index) =>
          hiddenCols.includes(key) ? null : (
            <td
              key={index}
              className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                key === "statuserror" && getRowColor(item[key])
              }`}
            >
              <Typography>
                {key === "duration"
                  ? moment.utc(item[key] * 1000).format("HH:mm:ss")
                  : key === "statuserror"
                  ? item["statuserror_name"]
                  : item[key]}
              </Typography>
            </td>
          )
        )}
      </tr>
    ));

  return (
    <Dialog
      size="xxl"
      open={isDialogOpen}
      handler={handler}
      className="dark:bg-blue-gray-900 dark:text-white"
    >
      <DialogHeader className="justify-end">
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
            <DeviceDetails device_data={device_data} />
            <SensorSection
              filteredData={filteredData}
              sensor_data={sensor_data}
              chartData={chartData}
              selectedSensorId={selectedSensorId}
              handleSensorSelection={handleSensorSelection}
              renderTableHeaders={renderTableHeaders}
              renderTableRows={renderTableRows}
            />
          </>
        ) : (
          <Typography>No device data</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
};

const DeviceDetails = ({ device_data }) => (
  <Card className="dark:bg-blue-gray-900 dark:text-white border basis-1/6 row-span-2 col-span-1 rounded-none border-none">
    <CardBody className="flex w-full flex-col justify-between gap-2">
      {Object.entries({
        ID: device_data?.name,
        "Seriya raqami": device_data?.sn,
        "Obyekt nomi": device_data?.adres,
        "Mas'ul xodim": device_data?.masul_hodim,
        "Xodim telefon raqami": device_data?.phone || "Raqam mavjud emas",
      }).map(([label, value], i) => (
        <div key={i} className="flex flex-col">
          <span>{label}</span>
          <Typography className="font-bold">{value}</Typography>
        </div>
      ))}
    </CardBody>
  </Card>
);

const SensorSection = ({
  sensor_data,
  chartData,
  filteredData,
  selectedSensorId,
  handleSensorSelection,
  renderTableHeaders,
  renderTableRows,
}) => (
  <div
    className={`dark:text-white border-none basis-5/6 col-span-4 shadow-none overflow-y-auto text-center ${
      sensor_data?.length === 0 || !chartData ? "row-span-2" : ""
    }`}
  >
    <div className="justify-around w-full flex mb-5 flex-wrap gap-2 items-center">
      {sensor_data?.map((item, index) => (
        <SensorCard
          {...item}
          key={index}
          handler={() => handleSensorSelection(item.sensor_id)}
          isActive={selectedSensorId === item.sensor_id}
        />
      ))}
    </div>
    {chartData && [2, 3, 16].includes(selectedSensorId) && (
      <Card className="col-span-3 row-span-1 shadow-none dark:bg-transparent">
        <CardBody className="p-0">
          <Chart
            options={{
              chart: {
                id: "basic-bar",
                type: "area",
                height: 350,
                animations: { enabled: false },
              },
              dataLabels: { enabled: false },
              xaxis: { type: "datetime", labels: { format: "dd MMM HH:mm" } },
              stroke: { curve: "smooth" },
              theme: { mode: "dark" },
              colors: ["#39B69A"],
              tooltip: {
                x: { format: "dd MMM HH:mm" },
                y: { formatter: (val) => val.toFixed(2) },
              },
            }}
            series={chartData}
            type="area"
            height={350}
          />
        </CardBody>
      </Card>
    )}
    {filteredData?.length > 0 && (
      <Card className="shadow-none dark:bg-transparent mt-5">
        <table className="table-auto w-full no-scrollbar text-xs">
          <thead>{renderTableHeaders()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </Card>
    )}
  </div>
);

export default DeviceModal;
