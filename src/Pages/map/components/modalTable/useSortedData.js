// useSortedData.js
import { useMemo } from "react";
import { sortData } from "./utils";

export const useSortedData = (
  data,
  sortedColumn,
  sortOrder,
  searchTerm,
  selectedFilter,
  columnFilters
) => {
  return useMemo(() => {
    let filteredData = [...data];

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, value]) => {
      if (value) {
        const baseColumn = column.replace("_name", "");
        const idColumn = `${baseColumn}_id`;
        filteredData = filteredData.filter((item) => item[idColumn] === value);
      }
    });

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply selected filter
    if (selectedFilter) {
      filteredData = filteredData.filter(
        (item) => item.type === selectedFilter
      );
    }

    // Apply sorting
    if (sortedColumn) {
      filteredData = sortData(filteredData, sortedColumn, sortOrder);
    }

    return filteredData;
  }, [
    data,
    sortedColumn,
    sortOrder,
    searchTerm,
    selectedFilter,
    columnFilters,
  ]);
};
