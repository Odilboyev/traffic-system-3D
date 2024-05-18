import React, { useState, useEffect } from "react";
import moment from "moment";
import { IconButton, Typography } from "@material-tailwind/react";
import { GetCurrentAlarms, getErrorHistory } from "../../../../apiHandlers";
import HistoryTable from "./history";

const CurrentAlarms = ({ isSidebar }) => {
  const [data, setCurrentAlarms] = useState(null);

  const itemsPerPage = 10; // Number of items to display per page
  const [historyData, setHistoryData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);
  const [casesSinceMidnight, setCasesSinceMidnight] = useState(0);
  console.log(data, "currentdata");
  const [historyOpen, setHistoryOpen] = useState(false);
  const handleHistoryopen = () => {
    setHistoryOpen(!historyOpen);
  };

  useEffect(() => {
    getCurrentAlarmsData();
  }, [isSidebar]);

  const getCurrentAlarmsData = async () => {
    try {
      const res = await GetCurrentAlarms();
      console.log(res);
      setCurrentAlarms(res.data);
    } catch (error) {
      throw new Error(error);
    }
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
    <>
      <div className="flex items-center px-1 pb-2">
        <IconButton onClick={handleHistoryopen} variant="text">
          <i className="fa-solid fa-clock-rotate-left"></i>{" "}
        </IconButton>
        <div className="pl-4 ">
          <Typography variant="h5">Hozirgi holat</Typography>
        </div>
      </div>
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
            <table className="min-w-full text-center table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4"
                  >
                    Vaqt
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4"
                  >
                    Device Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4"
                  >
                    Sensor Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4"
                  >
                    Status
                  </th>
                  {/* <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4"
                    >
                      Status
                    </th> */}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      item.statuserror == "2"
                        ? "bg-red-600 text-white"
                        : item.statuserror == "1"
                        ? "bg-orange-600 text-white"
                        : item.statuserror == "3"
                        ? "bg-gray-600 text-white"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  border-collapse border">
                      {index + 1}
                    </td>
                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap border-collapse border">
                      <div className="font-bold">
                        {moment(item.datetime).format("HH:mm:ss")}
                      </div>
                      <div>{moment(item.datetime).format("YYYY-MM-DD")}</div>
                    </td>
                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap  border-collapse border">
                      {item.device_name}
                    </td>
                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap  border-collapse border">
                      {item.sensor_name}
                    </td>
                    <td className="text-sm font-light px-6 py-4 whitespace-nowrap  border-collapse border">
                      {item.statuserror_name}
                    </td>
                    {/* <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status == 3
                              ? "bg-red-100 text-red-800"
                              : item.status == 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td> */}
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
    </>
  );
};

export default CurrentAlarms;
