import { sortData } from "./utils";
// useSortedData.js
import { useMemo } from "react";

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

    // Apply search filter with name prioritization
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter((item) => {
        // First, check if name matches
        const nameMatch =
          item.name &&
          item.name.toString().toLowerCase().includes(lowerSearchTerm);

        // If name matches, return true
        if (nameMatch) return true;

        // Otherwise, check other fields
        return Object.entries(item).some(
          ([key, val]) =>
            val &&
            val.toString().toLowerCase().includes(lowerSearchTerm) &&
            // Exclude certain keys that might not be relevant for searching
            !["id", "created_at", "updated_at"].includes(key)
        );
      });
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
