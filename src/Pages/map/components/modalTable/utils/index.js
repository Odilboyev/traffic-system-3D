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
  const hiddenKeys = [
    "lat",
    "lng",
    "location",
    "statuserror_name",
    "crossroad_id",
    "vendor_id",
    "region_id",
    "district_id",
    "device_id",
  ];
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

export const getOrderedColumns = (columns) => {
  const columnOrder = [
    "id",
    "name",
    "crossroad_name",
    "region_name",
    "district_name",
  ];

  return columns.sort((a, b) => {
    const indexA = columnOrder.indexOf(a);
    const indexB = columnOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};
