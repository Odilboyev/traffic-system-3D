import { Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { t } from "i18next";

// Function to get chart options
const getChartOptions = (isArea = false) => ({
  chart: {
    height: 350,
    stacked: !isArea,
    zoom: {
      enabled: false, // Disable zoom functionality
    },
    toolbar: {
      show: false, // Hide the toolbar
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  dataLabels: {
    enabled: false, // <--- HERE
  },
  stroke: {
    width: 0.9,
    curve: "smooth",
  },
  fill: {
    opacity: 1,
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
    },
  },
  yaxis: {
    labels: {
      minWidth: 40,
    },
  },
});

// Component to render a bar chart
const BarChart = ({ data, title }) => (
  <div className="mt-6 w-1/2">
    <Typography className="font-bold text-center">{title}</Typography>
    <Chart
      type="bar"
      width="100%"
      height="300"
      options={getChartOptions()}
      series={data}
    />
  </div>
);

// Component to render an area chart
const AreaChart = ({ data, title }) => (
  <div className="mt-6 w-1/2">
    <Typography className="font-bold text-center">{title}</Typography>
    <Chart
      type="area"
      width="100%"
      height="300"
      options={getChartOptions(true)}
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

  return (
    <>
      {/* Counts for all */}
      <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 text-white">
        <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r">
          <p>{t("yesterday")}</p>
          <b>{all_direction_data.counts_for_all.count_all_yesterday[0]}</b>
        </div>
        <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
          <p>{t("today")}</p>
          <b>{all_direction_data.counts_for_all.count_all_today[0]}</b>
        </div>
      </div>
      <div className="flex w-full">
        <BarChart
          data={formatChartDataByDate(all_direction_data.chart_data_by_date)}
          title={t("Traffic Counts by Date for Direction")}
        />
        <AreaChart
          data={formatChartByHourData(all_direction_data.chart_by_hour)}
          title={t("Traffic Counts by Hour for Direction")}
        />
      </div>

      {/* Direction-specific charts */}
      {by_direction_data.map((direction, index) => (
        <div key={index} className="mb-6 border-b">
          <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500 text-white">
            <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r">
              <p>{t("yesterday")}</p>
              <b>{direction.counts_for_direction.count_direction_yesterday}</b>
            </div>
            <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
              <p>{t("today")}</p>
              <b>{direction.counts_for_direction.count_direction_today}</b>
            </div>
          </div>
          <Typography className="mt-6 font-bold text-left">
            {index + 1}. {direction.direction_name}
          </Typography>
          <div className="flex">
            <BarChart
              data={formatChartDataByDate(direction.chart_data_by_date)}
              title={t("Traffic Counts by Date for Direction")}
            />
            <AreaChart
              data={formatChartByHourData(direction.chart_by_hour)}
              title={t("Traffic Counts by Hour for Direction")}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default CrossroadStats;
