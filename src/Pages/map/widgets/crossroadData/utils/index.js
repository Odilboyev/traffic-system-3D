export const transformDataForCharts = (data) => {
  return data.map((direction) => {
    const series = [
      { name: "carmid", data: [] },
      { name: "carbig", data: [] },
      { name: "carsmall", data: [] },
    ];

    direction.data.forEach((item) => {
      const { date, carmid, carbig, carsmall } = item;
      series[0].data.push({ x: date, y: carmid });
      series[1].data.push({ x: date, y: carbig });
      series[2].data.push({ x: date, y: carsmall });
    });

    return { directionName: direction.direction_name, series };
  });
};
