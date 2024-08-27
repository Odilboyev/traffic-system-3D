import { memo, useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import Loader from "../../../loader";
import Modal from "../../../modal";
import { t } from "i18next";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { useMap } from "react-leaflet";
import { useTheme } from "../../../../customHooks/useTheme";
import { MdSearch, MdEdit, MdDelete, MdHistory } from "react-icons/md"; // Import additional icons
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

const ModalTable = ({
  open,
  showActions,
  title,
  handleOpen,
  itemCallback,
  data = [],
  isLoading,
  totalPages,
  fetchHandler,
}) => {
  const { theme } = useTheme();
  const [showTableActions, setShowTableActions] = useState(showActions);
  const [titleToShow, setTitleToShow] = useState(t(title));
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const map = useMap(); // Get the map instance using useMap hook

  const [isSubPageOpen, setIsSubPageOpen] = useState(false);
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

  // // Remove 'lat', 'lng', and 'location' and add a single 'location' header
  // // tableHeaders = tableHeaders.filter(
  // //   (key) => key !== "lat" && key !== "lng" && key !== "location"
  // // );
  // // if (
  // //   data.length > 0 &&
  // //   ("lat" in data[0] || "lng" in data[0] || "location" in data[0])
  // // ) {
  // //   tableHeaders.push("location");
  // // }

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
      handleOpen={() => {
        handleOpen();
        setCurrentPage(1);
      }}
      title={titleToShow}
      body={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between w-full py-3">
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
              {isSubPageOpen && (
                <Button
                  onClick={() => {
                    setTitleToShow(t(title));
                    fetchHandler(title, currentPage);
                    setShowTableActions(true);
                    setIsSubPageOpen(false);
                  }}
                  size="sm"
                  className="flex gap-4 items-center "
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  Back
                </Button>
              )}
            </div>

            {data?.length > 0 ? (
              <table className="w-full table-auto overflow-x-scroll border border-slate-400">
                <thead className="text-left">
                  <tr className="font-bold">
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
                    {/* Add a header for the control column */}
                    {showTableActions && (
                      <th className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white">
                        <Typography className="font-bold">
                          {t("actions")} {/* Translate 'actions' */}
                        </Typography>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="overflow-x-scroll font-bold">
                  {filteredData.map((item, i) => (
                    <tr
                      key={i}
                      className={`dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                    >
                      {tableHeaders.map((key, index) => {
                        return (
                          <td
                            key={index}
                            className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                              key === "statuserror" && getRowColor(item[key])
                            }`}
                          >
                            <Typography>{item[key]}</Typography>
                          </td>
                        );
                      })}
                      {/* Control column */}
                      {showActions && (
                        <td className="px-4 py-1 flex gap-3 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white">
                          {(item.lat && item.lng) || item.location ? (
                            <IconButton
                              onClick={() =>
                                item.lat
                                  ? locationHandler({
                                      lat: item.lat,
                                      lng: item.lng,
                                    })
                                  : locationHandler(JSON.parse(item.location))
                              }
                            >
                              <LiaSearchLocationSolid className="font-bold w-5 h-5" />
                            </IconButton>
                          ) : null}

                          {title !== "crossroad" && (
                            <IconButton
                              onClick={() => {
                                console.log(item, "item");
                                setShowTableActions(false);
                                setIsSubPageOpen(true);
                                itemCallback(1, item.id);
                                setTitleToShow(`${t("history")} - ${title}`);
                              }}
                            >
                              <MdHistory className="font-bold w-5 h-5" />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => console.log("Edit clicked")}
                          >
                            <MdEdit className="font-bold w-5 h-5" />
                          </IconButton>
                          <IconButton
                            onClick={() => console.log("Delete clicked")}
                          >
                            <MdDelete className="font-bold w-5 h-5" />
                          </IconButton>
                        </td>
                      )}
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

export default memo(ModalTable);

const getRowColor = (status) => {
  switch (Number(status)) {
    case 0:
      return "bg-green-100 text-center dark:bg-green-900 dark:text-white";
    case 1:
      return "bg-orange-100 text-center dark:bg-orange-900 dark:text-white";
    case 2:
      return "bg-red-100 text-center dark:bg-red-900 dark:text-white";
    case 3:
      return "bg-blue-gray-100 text-gray-900 text-center dark:bg-blue-gray-700 dark:text-white";
    default:
      return "bg-white text-center dark:bg-blue-gray-900 dark:text-white";
  }
};
