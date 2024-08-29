import { Button, ButtonGroup } from "@material-tailwind/react";
import React, { useState } from "react";
import { useTheme } from "../../../../customHooks/useTheme";
import { t } from "i18next";

const FilterTypes = ({ typeOptions, onFilterChange, ...rest }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { theme } = useTheme();
  const handleFilterClick = (filterValue) => {
    setSelectedFilter(filterValue);
    onFilterChange(filterValue);
  };

  return (
    <div className="flex gap-3" {...rest}>
      {/* "All" Button */}
      {/* <Button
        color={theme === "dark" ? "white" : "black"}
        variant={selectedFilter === undefined ? "filled" : "outlined"}
        onClick={() => handleFilterClick(undefined)}
      >
        {t("all")}
      </Button> */}
      {/* Filter buttons for each type */}
      {typeOptions.map(({ type, type_name }) => (
        <Button
          key={type}
          color={theme === "dark" ? "white" : "black"}
          variant={selectedFilter === type ? "filled" : "outlined"}
          onClick={() => handleFilterClick(type)}
        >
          {t(type_name)}
        </Button>
      ))}
    </div>
  );
};

export default FilterTypes;
