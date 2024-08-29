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
import { MdSearch, MdEdit, MdDelete, MdHistory } from "react-icons/md";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import moment from "moment/moment";
import FilterTypes from "./filterTypes";

const ModalTable = ({
  open,
  showActions,
  title,
  handleOpen,
  itemCallback,
  data = [],
  isLoading,
  totalItems = 0,
  totalPages,
  fetchHandler,
}) => {
  const { theme } = useTheme();
  const [showTableActions, setShowTableActions] = useState(showActions);
  const [titleToShow, setTitleToShow] = useState(
    title ? t(title) : t("history")
  );
  useEffect(() => {
    setTitleToShow(t(title));
    console.log(title, "setTitleToShow");
  }, [title, open]);

  const [subPageId, setSubPageId] = useState(null);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(undefined);
  const map = useMap();

  const [isSubPageOpen, setIsSubPageOpen] = useState(false);
  useEffect(() => {
    if (open) {
      if (!isSubPageOpen && currentPage !== 1) {
        fetchHandler(currentPage, selectedFilter);
      } else if (isSubPageOpen) {
        itemCallback(currentPage, title, subPageId);
      }
    }
  }, [currentPage, open, selectedFilter]);

  useEffect(() => {
    if (data.length > 0) {
      const sorted = sortData(data, sortedColumn, sortOrder);
      const searched = sorted.filter((item) => {
        return Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      const filtered = selectedFilter
        ? searched.filter((item) => item.type === selectedFilter)
        : searched;

      setFilteredData(filtered);
    }
  }, [data, sortedColumn, sortOrder, searchTerm, selectedFilter]);

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

  let tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  const locationHandler = ({ lat, lng }) => {
    console.log(lat, lng);
    if (lat && lng) {
      map.flyTo([lat, lng], 20);
    }
    handleOpen();
  };
  const shouldHideColumn = (key) => {
    const hiddenKeys = ["lat", "lng", "location", "statuserror_name"];
    const hiddenOnSubPageKeys = ["type", "type_name", "device_id"];
    const hiddenOnAllHistory = [
      "type",
      selectedFilter === null && "type_name",
      "device_id",
    ];

    return (
      hiddenKeys.includes(key) ||
      (isSubPageOpen && hiddenOnSubPageKeys.includes(key)) ||
      (!itemCallback && hiddenOnAllHistory.includes(key))
    );
  };
  const historyHandler = (item) => {
    setShowTableActions(false);
    setCurrentPage(1);
    setIsSubPageOpen(true);
    itemCallback(1, title, item.id);
    setSubPageId(item.id);
    setTitleToShow(`${t("history")} - ${title} ${"- " + item.name}`);
  };

  return (
    <Modal
      open={open}
      handleOpen={() => {
        handleOpen();
        setIsSubPageOpen(false);
        setTitleToShow("");
        setCurrentPage(1);
      }}
      title={titleToShow}
      body={
        <>
          <div className="flex justify-between w-full py-3">
            <div
              className={`${
                itemCallback ? "w-2/6" : "w-4/6"
              } flex justify-between gap-5 `}
            >
              <div
                className={`${
                  itemCallback ? "w-full" : "w-3/6"
                } flex justify-between gap-5 `}
              >
                <Input
                  size="sm"
                  color={theme === "dark" ? "white" : "black"}
                  label={t("search")}
                  value={searchTerm}
                  className=" dark:focus:!border-b-white dark:focus:!border-x-white border-b-black focus:!border-t-0 border-x-black"
                  icon={<MdSearch className="dark:text-white" />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Static filter options */}
              {!itemCallback ? (
                <FilterTypes
                  typeOptions={[
                    { type: null, type_name: "all" },
                    { type: 1, type_name: "camera" },
                    { type: 3, type_name: "boxcontroller" },
                    { type: 4, type_name: "svetofor" },
                  ]}
                  onFilterChange={(selectedType) => {
                    setSelectedFilter(selectedType);
                    setCurrentPage(1);
                    fetchHandler(1, selectedType);
                  }}
                />
              ) : null}
            </div>
            {isSubPageOpen && (
              <Button
                onClick={() => {
                  setTitleToShow(t(title));
                  fetchHandler(title, currentPage);
                  setShowTableActions(true);
                  setIsSubPageOpen(false);
                }}
                className="flex gap-2 items-center  "
              >
                <ChevronLeftIcon className="w-5 h-5 m-0" />
                <p>{t("back")}</p>
              </Button>
            )}
          </div>
          {isLoading ? (
            <Loader />
          ) : data?.length > 0 ? (
            <table className="w-full table-auto overflow-x-scroll border border-slate-400">
              <thead className="text-left">
                <tr className="font-bold">
                  {tableHeaders.map((key, i) =>
                    shouldHideColumn(key) ? null : (
                      <th
                        className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white cursor-pointer"
                        key={i}
                        onClick={() => handleHeader(key)}
                      >
                        <div className="flex justify-between gap-4 items-center">
                          <Typography className="font-bold">
                            {t(key)}
                          </Typography>
                          {sortedColumn === key && (
                            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                    )
                  )}
                  {showTableActions && (
                    <th className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white">
                      <Typography className="font-bold">
                        {t("actions")}
                      </Typography>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="overflow-x-scroll font-bold">
                {filteredData.map((item, i) => (
                  <tr
                    key={i}
                    onClick={() => (itemCallback ? historyHandler(item) : {})}
                    className={`dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                  >
                    {tableHeaders.map((key, index) =>
                      shouldHideColumn(key) ? null : (
                        <td
                          key={index}
                          className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                            key === "statuserror" && getRowColor(item[key])
                          }`}
                        >
                          <Typography>
                            {key === "duration"
                              ? moment.utc(item[key] * 1000).format("HH:mm:ss")
                              : key === "statuserror"
                              ? item["statuserror_name"]
                              : item[key]}
                          </Typography>
                        </td>
                      )
                    )}

                    {showActions && !isSubPageOpen && (
                      <td className="p-2 flex gap-2 justify-start">
                        {title !== "crossroad" && (
                          <IconButton
                            color="amber"
                            size="sm"
                            onClick={() => historyHandler(item)}
                          >
                            <MdHistory className="text-white" />
                          </IconButton>
                        )}
                        <IconButton
                          color="green"
                          size="sm"
                          onClick={() => {
                            item.lat
                              ? locationHandler({
                                  lat: item.lat,
                                  lng: item.lng,
                                })
                              : locationHandler(JSON.parse(item.location));
                          }}
                        >
                          <LiaSearchLocationSolid className="text-white" />
                        </IconButton>
                        {/* <IconButton color="blue" size="sm">
                          <MdEdit className="text-white" />
                        </IconButton>
                        <IconButton color="red" size="sm">
                          <MdDelete className="text-white" />
                        </IconButton> */}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-[30vh]">
              <Typography>{t("nodata")}</Typography>
            </div>
          )}
        </>
      }
      footer={
        totalPages != null && (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages ? totalPages : 0}
            onPageChange={handlePageChange}
          />
        )
      }
      titleColor={theme === "dark" ? "white" : "black"}
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
