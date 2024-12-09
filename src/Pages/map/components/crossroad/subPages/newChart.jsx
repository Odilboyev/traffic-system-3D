import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";

import Chart from "react-apexcharts";
import { t } from "i18next";
import { useState } from "react";

const getChartOptions = (isArea = false, isDarkMode = false) => ({
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
  tooltip: {
    enabled: true,
    theme: isDarkMode ? "dark" : "light",
    marker: {
      show: true,
    },
    items: {
      display: "flex",
    },
    fixed: {
      enabled: false,
      position: "topRight",
      offsetX: 0,
      offsetY: 0,
    },
    y: {
      formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
        if (series.length > 1) {
          const currentValue = value;
          const otherSeriesIndex = seriesIndex === 0 ? 1 : 0;
          const otherValue = series[otherSeriesIndex][dataPointIndex];

          if (otherValue !== 0) {
            const percentageDiff = (
              ((currentValue - otherValue) / otherValue) *
              100
            ).toFixed(1);
            const absoluteDiff = Math.abs(currentValue - otherValue);
            const trendSymbol = currentValue > otherValue ? "↑" : "↓";

            return `${value.toLocaleString()} ${trendSymbol} ${absoluteDiff.toLocaleString()} (${percentageDiff}%)`;
          }
        }
        return value.toLocaleString();
      },
    },
  },
  dataLabels: {
    // enabled: true,
    style: {
      fontSize: "12px",
      colors: [isDarkMode ? "#E5E7EB" : "#1F2937"],
    },
    formatter: function (val) {
      return val.toLocaleString();
    },
    offsetY: -20,
    background: {
      enabled: true,
      foreColor: isDarkMode ? "#374151" : "#FFFFFF",
      padding: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
      opacity: 0.9,
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
    colors: isDarkMode
      ? ["#0066CC", "#FF4500"] // Two distinct colors for "Today" and "Yesterday" in dark mode
      : ["#0066CC", "#FF8C00"], // Two distinct colors for "Today" and "Yesterday" in light mode
  },
  fill: {
    opacity: 0.7,
    colors: isDarkMode
      ? ["#0066CC", "#FF4500"] // Fill colors for dark mode
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
    type: isArea ? "category" : "datetime",
    labels: {
      format: isArea ? "HH:mm" : "dd.MM.yy",
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
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: isDarkMode ? "#E5E7EB" : "#1F2937",
    },
  },
});

// Component to render a bar chart
const BarChart = ({ data, title, isDarkMode }) => (
  <div className="mt-6 w-1/2">
    <Typography className="font-bold text-center text-gray-800 dark:!text-gray-200 mb-6">
      {title}
    </Typography>
    <Chart
      type="bar"
      width="100%"
      height="400"
      options={getChartOptions(false, isDarkMode)}
      series={data}
    />
  </div>
);

// Component to render an area chart
const AreaChart = ({ data, title, isDarkMode }) => (
  <div className="mt-6 w-1/2">
    <Typography className="font-bold text-center text-gray-800 dark:!text-gray-200 mb-6">
      {title}
    </Typography>
    <Chart
      type="area"
      width="100%"
      height="400"
      options={getChartOptions(true, isDarkMode)}
      series={data}
    />
  </div>
);

// Main CrossroadStats Component
const CrossroadStats = ({ crossroadStats, selectedDate, onDateChange }) => {
  const { all_direction_data, by_direction_data } = crossroadStats;
  const [activeTab, setActiveTab] = useState("all");

  // Format series data for charts
  const formatChartDataByDate = (chartData) => {
    if (!chartData) return [];
    return [
      {
        name: t("counts"),
        data: chartData.map((entry) => ({
          x: new Date(entry.date).getTime(),
          y: Number(entry.count),
        })),
      },
    ];
  };

  const formatChartByHourData = (chartData) => {
    if (!chartData) return [];
    return [
      {
        name: t("today"),
        data: chartData.map((entry) => ({
          x: entry.hour,
          y: Number(entry.count_today || 0),
        })),
      },
      {
        name: t("yesterday"),
        data: chartData.map((entry) => ({
          x: entry.hour,
          y: Number(entry.count_yesterday || 0),
        })),
      },
    ];
  };

  // Detect if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <>
      <Tabs value={activeTab} className="w-full">
        <TabsHeader>
          <Tab
            key="all"
            value="all"
            onClick={() => setActiveTab("all")}
            className="px-4 py-2 text-sm h-auto"
          >
            {t("all_directions")}
          </Tab>
          {by_direction_data?.map((direction) => (
            <Tab
              key={direction.direction_id}
              value={direction.direction_id}
              onClick={() => setActiveTab(direction.direction_id)}
              className="px-4 py-2 text-sm h-auto"
            >
              {direction.direction_name}
            </Tab>
          ))}
        </TabsHeader>

        <TabsBody className="p-0">
          <TabPanel key="all" value="all" className="px-0 py-5">
            {/* Counts for all */}
            <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
              <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
                <p className="dark:text-gray-200">{t("yesterday")}</p>
                <b>
                  {all_direction_data?.counts_for_all.count_all_today.toLocaleString() ||
                    0}
                </b>
              </div>
              <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
                <p className="dark:text-gray-200">{t("today")}</p>
                <b>
                  {all_direction_data?.counts_for_all.count_all_yesterday.toLocaleString() ||
                    0}
                </b>
              </div>
            </div>

            {/* Charts for all directions */}
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
                <div className="flex w-full">
                  <BarChart
                    data={formatChartDataByDate(
                      all_direction_data.chart_data_by_date
                    )}
                    title={`${t("daily_counts")} - ${t("all_direction_data")}`}
                    isDarkMode={isDarkMode}
                  />
                  <AreaChart
                    data={formatChartByHourData(
                      all_direction_data?.chart_by_hour
                    )}
                    title={`${t("hourly_counts")} - ${t("all_direction_data")}`}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          {by_direction_data?.map((direction) => (
            <TabPanel
              key={direction.direction_id}
              value={direction.direction_id}
              className="px-0 py-5"
            >
              {/* Direction specific counts */}
              <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
                <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
                  <p className="dark:text-gray-200">{t("yesterday")}</p>
                  <b>
                    {direction?.counts_for_direction?.count_direction_yesterday.toLocaleString() ||
                      0}
                  </b>
                </div>
                <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
                  <p className="dark:text-gray-200">{t("today")}</p>
                  <b>
                    {direction?.counts_for_direction?.count_direction_today.toLocaleString() ||
                      0}
                  </b>
                </div>
              </div>

              {/* Direction specific charts */}
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex w-full">
                    <BarChart
                      data={formatChartDataByDate(direction.chart_data_by_date)}
                      title={`${t("daily_counts")} - ${
                        direction.direction_name
                      }`}
                      isDarkMode={isDarkMode}
                    />
                    <AreaChart
                      data={formatChartByHourData(direction?.chart_by_hour)}
                      title={`${t("hourly_counts")} - ${
                        direction.direction_name
                      }`}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

export default CrossroadStats;
