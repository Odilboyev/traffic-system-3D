import { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import Loader from "../../../Loader";
import Modal from "../../../Modal";
import { t } from "i18next";

const ModalTable = ({
  open,
  title,
  handleOpen,
  data = [],
  isLoading,
  totalPages,
  fetchHandler,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch modal data when type or currentPage changes
  useEffect(() => {
    open && currentPage !== 1 && fetchHandler(currentPage);
  }, [currentPage, open]);

  console.log(filteredData, "filtered data in modal");
  // Update filteredData when data or sorting criteria change
  useEffect(() => {
    if (data.length > 0) {
      const sorted = sortData(data, sortedColumn, sortOrder);
      setFilteredData(sorted);
    }
  }, [data, sortedColumn, sortOrder]);

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

  // Extract headers dynamically based on data keys
  const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Modal
      open={open}
      handleOpen={handleOpen}
      title={title}
      body={
        isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
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
              </tr>
            </thead>
            <tbody className="overflow-x-scroll font-bold">
              {filteredData.map((item, i) => (
                <tr
                  key={i}
                  className={`
                    dark:text-white 
                   text-black`}
                >
                  {tableHeaders.map((key, index) => (
                    <td
                      className={`px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white ${
                        key === "statuserror" && getRowColor(item[key])
                      }`}
                      key={index}
                    >
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
