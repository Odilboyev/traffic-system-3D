import { Checkbox, Typography } from "@material-tailwind/react";
import { t } from "i18next";

const WidgetControl = ({ filter, changeFilter }) => {
  const filterOptions = [
    { type: "all", label: t("all") },
    { type: "weather", label: t("weather") },
    { type: "bottomsection", label: t("devices") },
  ];

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      changeFilter({
        bottomsection: checked,
        weather: checked,
      });
    } else {
      changeFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  return (
    <div className="flex flex-col w-full">
      {filterOptions.map(({ type, label }) => (
        <Checkbox
          key={type}
          label={<Typography className="text-white">{label}</Typography>}
          ripple={false}
          className="m-0 p-0"
          checked={
            type === "all"
              ? filter.weather && filter.bottomsection
              : filter[type]
          }
          onChange={(e) => handleFilterChange(type, e.target.checked)}
        />
      ))}
    </div>
  );
};

export default WidgetControl;
