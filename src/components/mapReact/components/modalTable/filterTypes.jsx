import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { useTheme } from "../../../../customHooks/useTheme";
import { t } from "i18next";

const FilterTypes = ({
  active,
  filterOptions,
  onFilterChange,
  valueKey = "type",
  nameKey = "type_name",
  ...rest
}) => {
  // const [selectedFilter, setSelectedFilter] = useState(
  //   active ? active : typeOptions[0][valueKey]
  // );

  const { theme } = useTheme();

  const handleFilterClick = (filterValue) => {
    // setSelectedFilter(filterValue);
    onFilterChange(filterValue);
  };

  return (
    <div className="flex gap-3" {...rest}>
      {filterOptions?.map((option) => (
        <Button
          key={option[valueKey]}
          color={theme === "dark" ? "blue" : "black"}
          variant={active === option[valueKey] ? "filled" : "outlined"}
          onClick={() => handleFilterClick(option[valueKey])}
        >
          {t(option[nameKey])}
        </Button>
      ))}
    </div>
  );
};

export default FilterTypes;
