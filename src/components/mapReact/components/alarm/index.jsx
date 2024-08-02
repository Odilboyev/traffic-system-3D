import React, { useState, useEffect } from "react";
import moment from "moment";
import { IconButton, Typography } from "@material-tailwind/react";
import { GetCurrentAlarms, getErrorHistory } from "../../../../apiHandlers";
import HistoryTable from "./history";

const CurrentAlarms = ({ data, historyOpen, setHistoryOpen }) => {
  const itemsPerPage = 10; // Number of items to display per page
  const [historyData, setHistoryData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);
  const [casesSinceMidnight, setCasesSinceMidnight] = useState(0);
  const handleHistoryopen = () => {
    setHistoryOpen(!historyOpen);
  };

  const fetchErrorHistory = async (current) => {
    setHistoryLoading(true);
    try {
      const all = await getErrorHistory(current);

      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
      historyData.length === 0 && setIsDataLoaded(true);

      // const today = moment().startOf("day");
      // const cases = all.value.filter((item) => {
      //   const startDate = moment.unix(item.start_date);
      //   return startDate.isAfter(today) || startDate.isSame(today);
      // }).length;
      // setCasesSinceMidnight(cases);

      setHistoryLoading(false);
    } catch (err) {
      setHistoryLoading(false);
      console.log("Error fetching error history. Please try again.");
    }
  };
  return (
    <div className="bg-white">
      <HistoryTable
        open={historyOpen}
        handleOpen={handleHistoryopen}
        data={historyData}
        isLoading={historyLoading}
        itemsPerPage={itemsPerPage}
        historyTotalPages={historyTotalPages}
        fetchErrorHistory={fetchErrorHistory}
      />
      {/* lol */}
      <div className="flex flex-col w-full">
        {data?.length > 0 ? (
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Crossroad Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type Name
                  </th>{" "}
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Device Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sensor Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b font-bold ${
                      item.statuserror === 2
                        ? "bg-red-200  text-blue-gray-900"
                        : item.statuserror === 1
                        ? "bg-yellow-200  text-blue-gray-900"
                        : item.statuserror === 3
                        ? "bg-gray-200  text-gray-900"
                        : ""
                    } hover:bg-gray-100 hover:text-blue-gray-800 transition-colors duration-200`}
                  >
                    <td className="text-sm w-[5%] text-center">{index + 1}</td>
                    <td className="text-sm p-2 w-[14%]">
                      <div className="font-bold">
                        {moment(item.datetime).format("HH:mm:ss")}
                      </div>
                      <div>{moment(item.datetime).format("DD-MM-YYYY")}</div>
                    </td>
                    <td className="text-sm p-2 w-[14%]  ">
                      {item.crossroad_name}
                    </td>
                    <td className="text-sm p-2 w-[14%]  ">{item.type_name}</td>{" "}
                    <td className="text-sm p-2 w-[14%]  ">
                      {item.device_name}
                    </td>
                    <td className="text-sm p-2 w-[14%]  ">
                      {item.sensor_name}
                    </td>
                    <td className="text-sm p-2 w-[14%]  ">
                      {item.statuserror_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <Typography className="m-4">No alarms</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAlarms;
