import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  MenuItem,
} from "@material-tailwind/react";
import moment from "moment";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import Pagination from "@/components/pagination";
import { getErrorHistory } from "@/apiHandlers";
import Loader from "../../../Loader";

const TABLE_HEADER = [
  { name: "Event ID", keyName: "event_id" },
  { name: "Device Name", keyName: "device_name" },
  { name: "Sensor Name", keyName: "sensor_name" },
  { name: "Status Error", keyName: "start_status" },
  { name: "Start Date", keyName: "start_date" },
  { name: "End Date", keyName: "end_date" },
  { name: "Duration", keyName: "duration" },
];

const HistoryTable = ({
  open,
  handleOpen,
  data = [],
  isLoading,
  historyTotalPages,
  isHistoryDataLoaded,
  fetchErrorHistory,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    console.log(open, "open data");
    open && fetchErrorHistory(currentPage);
  }, [currentPage, open]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHeader = (keyName) => {
    if (sortedColumn === keyName) {
      // If the same column is clicked again, toggle the sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set the sorting order to ascending
      setSortOrder("asc");
      setSortedColumn(keyName);
    }
  };

  useEffect(() => {
    if (sortedColumn) {
      const sorted = sortData(data, sortedColumn, sortOrder);
      setFilteredData(sorted);
    }
  }, [sortedColumn, sortOrder]);

  const sortData = (data, sortedColumn, sortOrder) => {
    return [...data].sort((a, b) => {
      const valueA = a[sortedColumn];
      const valueB = b[sortedColumn];

      if (typeof valueA === "undefined" || typeof valueB === "undefined") {
        // Handle cases where the value is undefined
        return sortOrder === "asc" ? -1 : 1;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        // If both values are numbers, compare numerically
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        // If either value is a string or both are strings, compare as strings
        return sortOrder === "asc"
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
    });
  };

  const getRowColor = (status) => {
    switch (Number(status)) {
      case 0:
        return "bg-green-100  text-center dark:bg-green-900 dark:text-white ";
      case 1:
        return "bg-orange-100 text-center  dark:bg-orange-900 dark:text-white ";
      case 2:
        return "bg-red-100 text-center dark:bg-red-900 dark:text-white ";
      case 3:
        return "bg-blue-gray-100 text-gray-900 text-center dark:bg-gray-900 dark:text-white ";
      default:
        break;
    }
  };

  const tdClassName = `px-4 py-1 text-start border-seperate border border-blue-gray-900`;
  const thClassName = `pl-4 py-1 text-start border-seperate border border-blue-gray-900`;
  return (
    <>
      <Dialog
        size="xxl"
        open={open}
        handler={handleOpen}
        className="dark:bg-blue-gray-900 dark:!text-white text-blue-gray-900"
      >
        <DialogHeader className="justify-between">
          <div>
            <Typography variant="h5" className="dark:text-white">
              Tarix
            </Typography>
          </div>
          <IconButton size="sm" variant="text" onClick={handleOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll !px-5">
          {isLoading ? (
            <Loader />
          ) : data?.length > 0 ? (
            <table className="w-full table-fixed overflow-x-scroll border-seperate border border-slate-400">
              <thead className="text-left">
                <tr className=" font-bold">
                  {TABLE_HEADER.map((v, i) => (
                    <th className={`${thClassName} `} key={i}>
                      <div className=" flex justify-between items-center">
                        <Typography className="font-bold">{v.name}</Typography>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-x-scrol font-bold">
                {data.map((item, i) => (
                  <tr
                    key={i}
                    className={` ${getRowColor(
                      item.statuserror
                    )} text-blue-gray-900`}
                  >
                    <td className={tdClassName}>
                      <Typography>{item.alarm_id}</Typography>
                    </td>
                    <td className={tdClassName}>
                      <Typography>{item.device_name}</Typography>
                    </td>
                    <td className={tdClassName}>
                      <Typography>{item.sensor_name}</Typography>
                    </td>
                    <td className={`${tdClassName} !text-center`}>
                      <Typography>{item?.statuserror_name}</Typography>
                    </td>
                    <td className={tdClassName}>
                      <Typography className="font-bold ">
                        {item.start_date}
                      </Typography>
                    </td>
                    <td className={tdClassName}>
                      <Typography className="font-bold ">
                        {" "}
                        {item.end_date === null
                          ? "No end time available"
                          : item.end_date}
                      </Typography>
                    </td>
                    <td className={tdClassName} title="DD:HH:MM:SS">
                      <Typography className="font-bold">
                        {item.end_date === null
                          ? "No end date available"
                          : calculateDuration(item.start_date, item.end_date)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !isLoading && data?.length === 0 ? (
            <Typography>No data</Typography>
          ) : null}
        </DialogBody>
        <DialogFooter className="flex justify-center items-center mt-auto">
          {historyTotalPages != null && (
            <Pagination
              currentPage={currentPage}
              totalPages={historyTotalPages ? historyTotalPages : 0}
              onPageChange={handlePageChange}
            />
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default HistoryTable;

const calculateDuration = (start_date, end_date) => {
  // Parse the datetime strings into Date objects
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Calculate the difference in milliseconds
  const durationMs = endDate.getTime() - startDate.getTime();

  // Convert the duration to hours, minutes, and seconds
  const durationSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  // Format the duration as a string
  const durationString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return durationString;
};

const padZero = (value) => {
  return String(value).padStart(2, "0"); // Pad the value with leading zeros if necessary
};
