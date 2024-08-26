import { ListBulletIcon } from "@heroicons/react/16/solid";
import {
  Checkbox,
  IconButton,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Typography,
} from "@material-tailwind/react";
import { t } from "i18next";
import React, { useState } from "react";

const FilterControl = ({ placement, changeFilter, filter }) => {
  const filterOptions = [
    { type: "all", label: t("all") },
    { type: "box", label: t("boxcontroller") },
    { type: "camera", label: t("camera") },
    { type: "crossroad", label: t("crossroad") },
    { type: "trafficlights", label: t("svetofor") },
  ];

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      changeFilter({
        box: checked,
        camera: checked,
        crossroad: checked,
        trafficlights: checked,
      });
    } else {
      changeFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };
  return (
    <SpeedDial placement={placement}>
      <IconButton
        // color={theme === "light" ? "black" : "white"}
        size="lg"
      >
        <SpeedDialHandler className="w-10 h-10 cursor-pointer">
          <ListBulletIcon className="w-5 h-5 p-2" />
        </SpeedDialHandler>
      </IconButton>
      <SpeedDialContent className="ml-4">
        <div className="filter-panel p-2 pr-7 flex rounded-md flex-col bg-gray-900/80 text-whit backdrop-blur-md">
          {filterOptions.map(({ type, label }) => (
            <Checkbox
              key={type}
              label={<Typography className="text-white">{label}</Typography>}
              ripple={false}
              className="m-0 p-0"
              checked={
                type === "all"
                  ? filter.box && filter.camera && filter.crossroad
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

export default FilterControl;
