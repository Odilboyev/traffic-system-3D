import React, { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
  CardBody,
  Card,
  Button,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
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
import StatusBadge from "../../../statusBadge";
import { useMap } from "react-leaflet";
import { MapIcon } from "@heroicons/react/16/solid";
import { FaLocationDot } from "react-icons/fa6";
import FilterTypes from "../modalTable/filterTypes";

const hiddenCols = ["type", "type_name", "device_id", "statuserror_name"];

// Custom hook for fetching and sorting data
const useErrorHistory = (deviceId, sensorId) => {
  const [errorHistory, setErrorHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (sensorId) {
      fetchErrorHistory(sensorId);
    }
  }, [sensorId]);

  useEffect(() => {
    if (errorHistory?.length > 0) {
      setFilteredData(errorHistory);
    }
  }, [errorHistory]);

  const fetchErrorHistory = async (sensorId) => {
    try {
      const data = { type: 3, device_id: deviceId, sensor_id: sensorId };
      const res = await getErrorHistory(1, data);
      setErrorHistory(res.data);
    } catch (error) {
      console.error("Error fetching error history:", error);
    }
  };

  return { errorHistory, filteredData };
};

const DeviceModal = ({ device, isDialogOpen, handler, isLoading }) => {
  const { theme } = useTheme();
  const { device_data = {}, sensor_data = [] } = device || {};
  const [chartData, setChartData] = useState(null);
  const [selectedSensorId, setSelectedSensorId] = useState(null);

  const { errorHistory, filteredData } = useErrorHistory(
    device_data?.id,
    selectedSensorId
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
  // // const map = useMap();
  // const locationHandler = ({ lat, lng }) => {
  //   if (lat && lng) {
  //     map.flyTo([lat, lng], 20);
  //   }
  // };

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
  const columns = useMemo(() => {
    if (!errorHistory || errorHistory.length === 0) return [];

    return Object.keys(errorHistory[0])
      .filter((key) => !hiddenCols.includes(key))
      .map((key) => ({
        Header: t(key),
        accessor: key,
        Cell: ({ value }) => {
          if (key === "duration") {
            return moment.utc(value * 1000).format("HH:mm:ss");
          } else if (key === "statuserror") {
            const statusName = errorHistory.find(
              (item) => item[key] === value
            )?.statuserror_name;
            const statuserror = errorHistory.find(
              (item) => item[key] === value
            )?.statuserror;
            return <StatusBadge status={statuserror} statusName={statusName} />;
          } else {
            return value;
          }
        },
      }));
  }, [errorHistory, hiddenCols, t]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: filteredData,
      },
      useSortBy,
      usePagination
    );

  return (
    <Dialog
      size="xxl"
      open={isDialogOpen}
      handler={handler}
      className="dark:bg-blue-gray-900 dark:text-white"
    >
      <DialogHeader className="justify-end">
        <IconButton size="sm" onClick={handler}>
          <IoMdClose className="w-5 h-5 p-1" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-scroll flex gap-2 max-h-[90vh] no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : device_data ? (
          <>
            <DeviceDetails
              device_data={device_data}
              // locationHandler={locationHandler}
            />
            <SensorSection
              sensor_data={sensor_data}
              chartData={chartData}
              selectedSensorId={selectedSensorId}
              handleSensorSelection={handleSensorSelection}
              getTableProps={getTableProps}
              getTableBodyProps={getTableBodyProps}
              headerGroups={headerGroups}
              rows={rows}
              prepareRow={prepareRow}
            />
          </>
        ) : (
          <Typography>No device data</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
};

const DeviceDetails = ({ device_data, locationHandler }) => (
  <div className="basis-1/6 dark:bg-blue-gray-900 dark:text-white ">
    <Card className="dark:bg-blue-gray-900 dark:text-white shadow-lg border">
      <CardBody className="flex w-full flex-col justify-between gap-2 ">
        <div className="flex justify-between items-center border-b py-3">
          <Typography className="font-bold">{device_data.name}</Typography>
          <IconButton
            variant="text"
            // onClick={() =>
            // locationHandler({ lat: device_data.lat, lng: device_data.lng })
            // }
          >
            <FaLocationDot className="w-6 h-6  dark:text-white" />
          </IconButton>
        </div>
        {Object.entries({
          "Seriya raqami": device_data?.sn,
          "Obyekt nomi": device_data?.adres,
          "Mas'ul xodim": device_data?.masul_hodim,
          "Xodim telefon raqami": device_data?.phone || "Raqam mavjud emas",
        }).map(([label, value], i) => (
          <div key={i} className="flex flex-col border-b">
            <span>{label}</span>
            <Typography className="font-bold">{value}</Typography>
          </div>
        ))}
      </CardBody>
    </Card>
    <Card className="mt-5 dark:bg-blue-gray-900 dark:text-white shadow-lg border">
      <CardBody>
        <Typography className="font-bold border-b pb-2">
          {device_data.name}
        </Typography>
        <Button className="mt-4" color="blue">
          device_monitoring_rele_button_restart
        </Button>
        <Button className="mt-4" color="blue">
          device_monitoring_rele_button_restart
        </Button>
        <Button className="mt-4" color="blue">
          device_monitoring_rele_button_restart
        </Button>
        <Button className="mt-4" color="blue">
          device_monitoring_rele_button_restart
        </Button>
      </CardBody>
    </Card>
  </div>
);

const SensorSection = ({
  sensor_data,
  chartData,
  selectedSensorId,
  handleSensorSelection,
  // setSelectedFilter,
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
}) => (
  <div
    className={`p-2 no-scrollbar dark:text-white border-none basis-5/6 col-span-4 shadow-none overflow-y-auto  ${
      sensor_data?.length === 0 || !chartData ? "row-span-2" : ""
    }`}
  >
    <div className="w-full grid grid-cols-5 mb-5 gap-2 items-center">
      {sensor_data?.map((item, index) => (
        <SensorCard
          {...item}
          key={index}
          handler={() => handleSensorSelection(item.sensor_id)}
          isActive={selectedSensorId === item.sensor_id}
        />
      ))}
    </div>

    {/* Handle Chart Data */}
    {chartData && [2, 3, 16].includes(selectedSensorId) && (
      <div className="w-[90%] mx-auto py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Typography className="m-5 my-1 text-2xl">
          {sensor_data &&
            selectedSensorId &&
            sensor_data.find((id) => selectedSensorId == id.sensor_id)
              .sensor_name}
        </Typography>
        <Chart
          height={350}
          options={{
            chart: {
              id: "basic-bar",
              type: "area",
              animations: { enabled: false },
              toolbar: {
                show: true,
                tools: {
                  download: false,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                },
              },
              zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: true,
              },
            },
            fill: { opacity: 0.4 },
            dataLabels: { enabled: false },
            tooltip: { x: { format: "dd MMM yyyy HH:mm:ss" } },
            xaxis: { type: "datetime" },
          }}
          series={chartData}
          type="area"
        />
      </div>
    )}
    <Card className="px-0 dark:bg-blue-gray-900 dark:text-white border-t border-blue-gray-50 p-4 shadow-md rounded-lg">
      <CardBody className="px-0 pt-0">
        <div className="flex justify-between my-5">
          <Typography className="m-5 mt-2 text-2xl">
            {sensor_data &&
              selectedSensorId &&
              sensor_data.find((id) => selectedSensorId == id.sensor_id)
                ?.sensor_name}
          </Typography>
          <FilterTypes
            active={selectedSensorId}
            typeOptions={sensor_data.filter(
              (v) => ![2, 3, 16].includes(v.sensor_id)
            )}
            valueKey="sensor_id"
            nameKey="sensor_name"
            onFilterChange={(selectedSensor) => {
              // setSelectedFilter(selectedSensor);
              handleSensorSelection(selectedSensor);
            }}
          />
        </div>

        <table {...getTableProps()} className="min-w-full table-auto mx-0">
          <thead className="bg-gray-200 dark:bg-gray-800">
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b-2 border-gray-300 px-5 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  key={i}
                  {...row.getRowProps()}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 border-b"
                >
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      {...cell.getCellProps()}
                      className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  </div>
);

export default DeviceModal;
