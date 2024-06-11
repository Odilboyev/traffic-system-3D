import { Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { useState } from "react";
import ChartFilters from "../components/chartFilters";

const ModalCharts = ({
  directions,
  time,
  handleTime,
  interval,
  handleInterval,
}) => {
  const options = {
    chart: {
      // type: "line",
      // height: 350,
      // stacked: false,
    },
    colors: ["#0bd500", "#9700fb", "#0066e3", "#ff6600"],
    stroke: {
      width: 0.8,
    },
    dataLabels: {
      enabled: false, // <--- HERE
    },
    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     opacityFrom: 0.8,
    //     opacityTo: 0.4,
    //   },
    // },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd.MM.yy HH:MM",
        rotate: -45,
        tickPlacement: "on",
        // rotateAlways: true,
      },
    },
    yaxis: {
      labels: {
        minWidth: 40,
      },
    },
  };
  return (
    <>
      {/* create a div with 2 select components */}
      <ChartFilters
        time={time}
        timeHandler={handleTime}
        interval={interval}
        intervalHandler={handleInterval}
      />

      <div className="mt-16">
        {directions?.map((direction, i) => (
          <div className={` min-h-[50vh] overflow-visible`} key={i}>
            {" "}
            <div className="text-left px-3 flex">
              <Typography>{i + 1}.</Typography>
              <Typography className="font-bold text-blue-gray-900">
                {direction.directionName}
              </Typography>
            </div>
            <div className={` h-full`}>
              <Chart
                width={"100%"}
                height={"300"}
                key={direction.directionName}
                options={options}
                series={direction.series}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ModalCharts;
