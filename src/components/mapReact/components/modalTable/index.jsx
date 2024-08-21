import { useEffect, useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import Loader from "../../../Loader";
import Modal from "../../../Modal";
import { t } from "i18next";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { useMap } from "react-leaflet"; // Import useMap hook
import { useTheme } from "../../../../customHooks/useTheme";
import { MdSearch } from "react-icons/md";

const ModalTable = ({
  open,
  title,
  handleOpen,
  data = [],
  isLoading,
  totalPages,
  fetchHandler,
}) => {
  const { theme } = useTheme();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const map = useMap(); // Get the map instance using useMap hook

  // Fetch modal data when type or currentPage changes
  useEffect(() => {
    open && currentPage !== 1 && fetchHandler(currentPage);
  }, [currentPage, open]);

  // Update filteredData when data, sorting criteria, or search term change
  useEffect(() => {
    if (data.length > 0) {
      // Sort data based on the current sort criteria
      const sorted = sortData(data, sortedColumn, sortOrder);

      // Filter sorted data based on the search term
      const searched = sorted.filter((item) => {
        // Check if any field contains the search term
        return Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setFilteredData(searched);
    }
  }, [data, sortedColumn, sortOrder, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHeader = (keyName) => {
    if (sortedColumn === keyName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedColumn(keyName);
    }
  };

  const sortData = (data, sortedColumn, sortOrder) => {
    return [...data].sort((a, b) => {
      const valueA = a[sortedColumn];
      const valueB = b[sortedColumn];

      if (typeof valueA === "undefined" || typeof valueB === "undefined") {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        return sortOrder === "asc"
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
    });
  };

  // Extract headers dynamically based on data keys, excluding 'lat', 'lng', and 'location'
  let tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  // Remove 'lat', 'lng', and 'location' and add a single 'location' header
  tableHeaders = tableHeaders.filter(
    (key) => key !== "lat" && key !== "lng" && key !== "location"
  );
  if (
    data.length > 0 &&
    ("lat" in data[0] || "lng" in data[0] || "location" in data[0])
  ) {
    tableHeaders.push("location");
  }

  // Handle location click and fly to the map location
  const locationHandler = ({ lat, lng }) => {
    console.log(lat, lng);
    if (lat && lng) {
      map.flyTo([lat, lng], 20); // Adjust zoom level as needed
    }
    handleOpen();
  };

  return (
    <Modal
      open={open}
      handleOpen={handleOpen}
      title={title}
      body={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-6 w-1/6">
              <Input
                size="sm"
                color={theme === "dark" ? "white" : "black"}
                label={t("search")}
                value={searchTerm}
                className="dark:focus:!border-b-white dark:focus:!border-x-white border-b-black focus:!border-t-0 border-x-black"
                icon={<MdSearch className="dark:text-white" />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {data?.length > 0 ? (
              <table className="w-full table-auto overflow-x-scroll border border-slate-400">
                <thead className="text-left">
                  <tr className="font-bold hover:">
                    {tableHeaders.map((key, i) => (
                      <th
                        className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white cursor-pointer"
                        key={i}
                        onClick={() => handleHeader(key)}
                      >
                        <div className="flex justify-between gap-4 items-center">
                          <Typography className="font-bold">
                            {t(key)} {/* Translate column name */}
                          </Typography>
                          {sortedColumn === key && (
                            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="overflow-x-scroll font-bold">
                  {filteredData.map((item, i) => (
                    <tr
                      key={i}
                      className={`
        dark:text-white 
        text-black
        hover:bg-gray-100 dark:hover:bg-gray-700 // Add hover effect here
        cursor-pointer
      `}
                    >
                      {tableHeaders.map((key, index) => {
                        if (key === "location") {
                          return (
                            <td
                              onClick={() =>
                                locationHandler(
                                  item.lat
                                    ? { lat: item.lat, lng: item.lng }
                                    : JSON.parse(item.location)
                                )
                              }
                              className={`cursor-pointer px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white`}
                              key={index}
                            >
                              <Typography>
                                <LiaSearchLocationSolid />
                              </Typography>
                            </td>
                          );
                        } else {
                          return (
                            <td
                              className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                                key === "statuserror" && getRowColor(item[key])
                              }`}
                              key={index}
                            >
                              <Typography>{item[key]}</Typography>
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !isLoading && data?.length === 0 ? (
              <Typography>No data</Typography>
            ) : null}
          </>
        )
      }
      bottom={
        totalPages != null && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages ? totalPages : 0}
            onPageChange={handlePageChange}
          />
        )
      }
    />
  );
};

export default ModalTable;

const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return "bg-green-100 text-center dark:bg-green-900 dark:text-white";
    case 1:
      return "bg-orange-100 text-center dark:bg-orange-900 dark:text-white";
    case 2:
      return "bg-red-100 text-center dark:bg-red-900 dark:text-white";
    case 3:
      return "bg-blue-gray-100 text-gray-900 text-center dark:bg-gray-900 dark:text-white";
    default:
      return "";
  }
};
