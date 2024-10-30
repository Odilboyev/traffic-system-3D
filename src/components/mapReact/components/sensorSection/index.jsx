import { Card, CardBody, Typography } from "@material-tailwind/react";
import SensorCard from "../box/sensorCard";
import FilterTypes from "../modalTable/filterTypes";
import Chart from "react-apexcharts";
import { FiAlertCircle } from "react-icons/fi";

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
    className={`p-2 no-scrollbar dark:text-white border-none shadow-none overflow-y-auto  ${
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
    <div className="flex justify-between my-5">
      <Typography className="m-5 mt-2 text-2xl">
        {sensor_data &&
          selectedSensorId &&
          sensor_data.find((id) => selectedSensorId == id.sensor_id)
            ?.sensor_name}
      </Typography>
      <FilterTypes
        active={selectedSensorId}
        filterOptions={sensor_data}
        valueKey="sensor_id"
        nameKey="sensor_name"
        onFilterChange={(selectedSensor) => {
          // setSelectedFilter(selectedSensor);
          handleSensorSelection(selectedSensor);
        }}
      />
    </div>

    {/* Handle Chart Data */}
    {chartData && [2, 3, 16].includes(selectedSensorId) && (
      <div className="w-[90%] no-scrollbar mx-auto py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
    <Card className="px-0 no-scrollbar  dark:bg-blue-gray-900 dark:text-white border-t border-blue-gray-50 p-4 shadow-md rounded-lg">
      <CardBody className="px-0 pt-0 overflow-x-scroll no-scrollbar">
        <table
          {...getTableProps()}
          className="min-w-full table-auto mx-0 no-scrollbar "
        >
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
            {rows?.length > 0 ? (
              rows.map((row, i) => {
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
              })
            ) : (
              <tr>
                <td className="text-center py-5">
                  <FiAlertCircle className="h-6 w-6 mx-auto text-gray-500 dark:text-gray-400" />
                  <Typography className="mt-2 text-gray-700 dark:text-gray-200">
                    No Data Available
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  </div>
);
export default SensorSection;
