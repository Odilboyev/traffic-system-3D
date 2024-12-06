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

// Function to get chart options
// Function to get chart options with contrast colors
// Function to get chart options with distinct colors for each data type
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
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: {
      colors: isDarkMode ? "#E5E7EB" : "#1F2937",
    },
  },
  dataLabels: {
    enabled: isArea ? false : true,
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
      height="300"
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
      height="300"
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

        <TabsBody>
          <TabPanel key="all" value="all">
            {/* Counts for all */}
            <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
              <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
                <p className="dark:text-gray-200">{t("yesterday")}</p>
                <b>
                  {all_direction_data?.counts_for_all
                    ?.count_all_yesterday?.[0] || 0}
                </b>
              </div>
              <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
                <p className="dark:text-gray-200">{t("today")}</p>
                <b>
                  {all_direction_data?.counts_for_all?.count_all_today?.[0] ||
                    0}
                </b>
              </div>
            </div>

            {/* Charts for all directions */}
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
                <Typography variant="h6" className="mb-2">
                  {t("hourly_counts")}
                </Typography>
                <BarChart
                  data={formatChartByHourData(
                    all_direction_data?.chart_by_hour
                  )}
                  title={t("hourly_counts")}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </TabPanel>

          {by_direction_data?.map((direction) => (
            <TabPanel
              key={direction.direction_id}
              value={direction.direction_id}
            >
              {/* Direction specific counts */}
              <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
                <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
                  <p className="dark:text-gray-200">{t("yesterday")}</p>
                  <b>
                    {direction?.counts_for_direction
                      ?.count_direction_yesterday || 0}
                  </b>
                </div>
                <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
                  <p className="dark:text-gray-200">{t("today")}</p>
                  <b>
                    {direction?.counts_for_direction?.count_direction_today ||
                      0}
                  </b>
                </div>
              </div>

              {/* Direction specific charts */}
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
                  <Typography variant="h6" className="mb-2">
                    {t("hourly_counts")} - {direction.direction_name}
                  </Typography>
                  <BarChart
                    data={formatChartByHourData(direction?.chart_by_hour)}
                    title={`${t("hourly_counts")} - ${
                      direction.direction_name
                    }`}
                    isDarkMode={isDarkMode}
                  />
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
