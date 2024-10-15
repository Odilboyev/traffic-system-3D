export const singleBox = {
  tb_id: "123",
  name: "Device Name",
  xodimname: "John Doe",
  phone: "1234567890",
  sensors: [
    {
      name: "Sensor 1",
      value: 25,
      date: "2024-05-10T10:30:00Z",
      status: 0,
    },
    {
      name: "Sensor 2",
      value: 30,
      date: "2024-05-10T11:45:00Z",
      status: 1,
    },
    {
      name: "Sensor 3",
      value: 40,
      date: "2024-05-10T13:15:00Z",
      status: 2,
    },
  ],
};

export const options = {
  chart: {
    type: "area",
    // height: 350,
    stacked: false,
  },
  colors: ["#0bd500", "#9700fb", "#0066e3"],
  stroke: {
    curve: "monotoneCubic",
    width: 0.8,
  },
  dataLabels: {
    enabled: false, // <--- HERE
  },
  fill: {
    type: "gradient",

    gradient: {
      opacityFrom: 0.8,
      opacityTo: 0.4,
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000],
  },
};
export const series = [
  {
    name: "series-1",
    type: "line",
    stroke: {
      curve: "monotoneCubic",
      width: 1.4,
    },
    data: [35, 50, 45, 50, 60, 90, 50, 65, 65, 70],
  },
  {
    name: "series-2",

    type: "area",
    data: [85, 50, 40, 70, 28, 23, 80, 45, 95, 40],
  },
];
