import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import Loader from "../../../Loader";
import Modal from "../../../Modal";
import { t } from "i18next";

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
    open && fetchErrorHistory(currentPage);
  }, [currentPage, open]);

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

  const tdClassName = `px-4 py-1 text-start border-separate border border-blue-gray-900`;
  const thClassName = `pl-4 py-1 text-start border-separate border border-blue-gray-900`;

  // Extract headers dynamically based on data keys
  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      <Modal
        open={open}
        handleOpen={handleOpen}
        title={t("history")}
        body={
          isLoading ? (
            <Loader />
          ) : data?.length > 0 ? (
            <table className="w-full table-fixed overflow-x-scroll border border-slate-400">
              <thead className="text-left">
                <tr className="font-bold">
                  {tableHeaders.map((key, i) => (
                    <th
                      className={`${thClassName}`}
                      key={i}
                      onClick={() => handleHeader(key)}
                    >
                      <div className="flex justify-between items-center">
                        <Typography className="font-bold">
                          {key.replace(/_/g, " ")}
                        </Typography>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="overflow-x-scroll font-bold">
                {filteredData.map((item, i) => (
                  <tr
                    key={i}
                    className={`${getRowColor(
                      item.statuserror
                    )} text-blue-gray-900`}
                  >
                    {tableHeaders.map((key, index) => (
                      <td className={tdClassName} key={index}>
                        <Typography>{item[key]}</Typography>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !isLoading && data?.length === 0 ? (
            <Typography>No data</Typography>
          ) : null
        }
        bottom={
          historyTotalPages != null && (
            <Pagination
              currentPage={currentPage}
              totalPages={historyTotalPages ? historyTotalPages : 0}
              onPageChange={handlePageChange}
            />
          )
        }
      />
    </>
  );
};

export default HistoryTable;

const calculateDuration = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  const durationMs = endDate.getTime() - startDate.getTime();
  const durationSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
