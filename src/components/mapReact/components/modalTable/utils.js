// utils.js
export const sortData = (data, sortedColumn, sortOrder) => {
  return [...data].sort((a, b) => {
    const valueA = a[sortedColumn];
    const valueB = b[sortedColumn];

    if (valueA === undefined || valueB === undefined) {
      return sortOrder === "asc" ? -1 : 1;
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      return sortOrder === "asc"
        ? valueA?.toString().localeCompare(valueB?.toString())
        : valueB?.toString().localeCompare(valueA?.toString());
    }
  });
};

export const shouldHideColumn = (
  key,
  isSubPageOpen,
  selectedFilter,
  itemCallback
) => {
  const hiddenKeys = ["lat", "lng", "location", "statuserror_name"];
  const hiddenOnSubPageKeys = ["type", "type_name", "device_id"];
  const hiddenOnAllHistory = [
    "type",
    selectedFilter != null && "type_name",
    "device_id",
  ];

  return (
    hiddenKeys.includes(key) ||
    (isSubPageOpen && hiddenOnSubPageKeys.includes(key)) ||
    (!itemCallback && hiddenOnAllHistory.includes(key))
  );
};
