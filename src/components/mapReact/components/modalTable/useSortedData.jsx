// useSortedData.js
import { useMemo } from "react";
import { sortData } from "./utils";

export const useSortedData = (
  data,
  sortedColumn,
  sortOrder,
  searchTerm,
  selectedFilter
) => {
  return useMemo(() => {
    const sorted = sortData(data, sortedColumn, sortOrder);
    const searched = sorted.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return selectedFilter
      ? searched.filter((item) => item.type === selectedFilter)
      : searched.reverse();
  }, [data, sortedColumn, sortOrder, searchTerm, selectedFilter]);
};
