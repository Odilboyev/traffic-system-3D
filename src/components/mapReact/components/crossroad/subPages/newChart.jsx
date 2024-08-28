import { Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { t } from "i18next";

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
const CrossroadStats = ({ crossroadStats }) => {
  const { all_direction_data, by_direction_data } = crossroadStats;

  // Format series data for charts
  const formatChartDataByDate = (chartData) => {
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
    return [
      {
        name: t("today"),
        data: chartData.map((entry) => ({
          x: entry.hour,
          y: Number(entry.count_today),
        })),
      },
      {
        name: t("yesterday"),
        data: chartData.map((entry) => ({
          x: entry.hour,
          y: Number(entry.count_yesterday),
        })),
      },
    ];
  };

  // Detect if dark mode is enabled
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <>
      {/* Counts for all */}
      <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
        <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
          <p className="dark:text-gray-200">{t("yesterday")}</p>
          <b>{all_direction_data.counts_for_all.count_all_yesterday[0]}</b>
        </div>
        <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
          <p className="dark:text-gray-200">{t("today")}</p>
          <b>{all_direction_data.counts_for_all.count_all_today[0]}</b>
        </div>
      </div>
      <div className="flex w-full">
        <BarChart
          data={formatChartDataByDate(all_direction_data.chart_data_by_date)}
          title={t("Traffic Counts by Date for Direction")}
          isDarkMode={isDarkMode}
        />
        <AreaChart
          data={formatChartByHourData(all_direction_data.chart_by_hour)}
          title={t("Traffic Counts by Hour for Direction")}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Direction-specific charts */}
      {by_direction_data.map((direction, index) => (
        <div
          key={index}
          className="mb-6 border-b border-gray-200 dark:border-gray-600 dark:text-white"
        >
          <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 dark:bg-gray-700 text-white">
            <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-600">
              <p className="dark:text-gray-200">{t("yesterday")}</p>
              <b>{direction.counts_for_direction.count_direction_yesterday}</b>
            </div>
            <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
              <p className="dark:text-gray-200">{t("today")}</p>
              <b>{direction.counts_for_direction.count_direction_today}</b>
            </div>
          </div>
          <Typography className="mt-6 font-bold text-left text-gray-800 dark:text-gray-200">
            {index + 1}. {direction.direction_name}
          </Typography>
          <div className="flex">
            <BarChart
              data={formatChartDataByDate(direction.chart_data_by_date)}
              title={t("Traffic Counts by Date for Direction")}
              isDarkMode={isDarkMode}
            />
            <AreaChart
              data={formatChartByHourData(direction.chart_by_hour)}
              title={t("Traffic Counts by Hour for Direction")}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default CrossroadStats;
