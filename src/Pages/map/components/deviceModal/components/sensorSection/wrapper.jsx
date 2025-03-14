import { useEffect, useMemo, useState } from "react";
import { usePagination, useSortBy, useTable } from "react-table";

import DeviceDetails from "./deviceDetails";
import SensorSection from ".";
import StatusBadge from "../../../../../../components/statusBadge";
import { getBoxSensorChart } from "../../../../../../api/api.handlers";
import moment from "moment";
import { t } from "i18next";
import useSensorErrorHistory from "../../../../../../customHooks/useSensorHistory";

const hiddenCols = ["type", "type_name", "device_id", "statuserror_name"];

const SensorPartWrapper = ({ device, isInCrossroad }) => {
  const { device_data = {}, sensor_data = [] } = device || {};
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState(null);

  const {
    errorHistory,
    filteredData,
    isLoading: isErrorLoading,
  } = useSensorErrorHistory(device_data?.id, selectedSensorId);

  useEffect(() => {
    if (sensor_data?.length > 0) {
      handleSensorSelection(sensor_data[0].sensor_id);
    }
  }, [sensor_data]);

  const handleSensorSelection = async (sensorId) => {
    if ([2, 3, 16].includes(sensorId)) {
      setIsLoading(true);
      await fetchChartData(sensorId);
      setIsLoading(false);
    } else {
      setIsLoading(false);
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
    <>
      {device ? (
        <div className="grid grid-cols-[20%_80%] gap-4 w-full">
          <DeviceDetails
            device_data={device_data}
            isInCrossRoad={isInCrossroad}
            // locationHandler={locationHandler}
          />
          <SensorSection
            isLoading={isLoading || isErrorLoading}
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
        </div>
      ) : (
        <div className="text-center text-gray-400">{t("no_data_found")}</div>
      )}
    </>
  );
};

export default SensorPartWrapper;
