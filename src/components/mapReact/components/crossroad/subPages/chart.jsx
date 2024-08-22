import { Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import ChartFilters from "../components/chartFilters";
import { t } from "i18next";
// Default chart options
const getChartOptions = () => ({
  chart: {
    height: 350,
    stacked: true,
  },
  legend: {
    position: "right",
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadiusApplication: "end", // 'around', 'end'
      borderRadiusWhenStacked: "last", // 'all', 'last'
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
    type: "datetime",
    labels: {
      format: "dd.MM.yy HH:mm", // Fixed format typo HH:MM to HH:mm
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

const DirectionChart = ({ direction, index }) => (
  <div className="min-h-[50vh] overflow-visible">
    <div className="text-left px-3 flex">
      <Typography>{index + 1}.</Typography>
      <Typography className="font-bold">{direction.directionName}</Typography>
    </div>
    <div className="h-full">
      <Chart
        width="100%"
        height="300"
        type="bar"
        key={direction.directionName}
        options={getChartOptions()}
        series={direction.series}
      />
    </div>
  </div>
);

const ModalCharts = ({
  directions = [],
  time,
  handleTime,
  interval,
  handleInterval,
}) => (
  <>
    <ChartFilters
      time={time}
      timeHandler={handleTime}
      interval={interval}
      intervalHandler={handleInterval}
    />
    <div className="flex w-full rounded-md text-center items-center bg-blue-gray-500">
      <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center border-r">
        <p>{t("yesterday")}</p>
        <b> 18079</b>
      </div>
      <div className="w-1/2 h-[8vh] flex flex-col items-center justify-center">
        <p> {t("today")}: 13:08</p> <b>6890</b>
      </div>
    </div>
    <div className="mt-16">
      {directions.map((direction, i) => (
        <DirectionChart key={i} direction={direction} index={i} type="bar" />
      ))}
    </div>
  </>
);

export default ModalCharts;
