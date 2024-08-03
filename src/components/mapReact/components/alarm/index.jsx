import React, { useState, useEffect } from "react";
import moment from "moment";
import { IconButton, Typography } from "@material-tailwind/react";
import { GetCurrentAlarms, getErrorHistory } from "../../../../apiHandlers";
import HistoryTable from "./history";

const CurrentAlarms = ({ data, historyOpen, setHistoryOpen }) => {
  return (
    <div className=" dark:bg-gray-900">
      {/* lol */}
      <div className="flex flex-col w-full">
        {data?.length > 0 ? (
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Crossroad Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Type Name
                  </th>{" "}
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Device Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Sensor Name
                  </th>
                  <th
                    scope="col"
                    className="p-2   text-left  text-xs font-medium  uppercase tracking-wider"
                  >
                    Status Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b font-bold ${
                      item.statuserror === 2
                        ? "bg-red-200  "
                        : item.statuserror === 1
                        ? "bg-yellow-200 "
                        : item.statuserror === 3
                        ? "bg-gray-200 "
                        : ""
                    } hover:bg-transparent transition-colors duration-200`}
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
