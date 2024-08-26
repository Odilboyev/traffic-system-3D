import {
  Checkbox,
  IconButton,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Typography,
} from "@material-tailwind/react";
import { t } from "i18next";
import React from "react";
import { MdWidgets } from "react-icons/md";

const WidgetControl = ({ placement, changeFilter, filter }) => {
  const filterOptions = [
    { type: "all", label: t("all") },
    { type: "bottomsection", label: t("devices") },
    { type: "weather", label: t("weather") },
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
    <SpeedDial placement={placement}>
      <SpeedDialHandler>
        <IconButton size="lg">
          <MdWidgets className="w-5 h-5" />
        </IconButton>
      </SpeedDialHandler>
      <SpeedDialContent className="ml-4">
        <div className="filter-panel p-2 pr-7 flex rounded-md flex-col bg-gray-900/80 text-white backdrop-blur-md">
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
      </SpeedDialContent>
    </SpeedDial>
  );
};

export default WidgetControl;
