import React, { useContext } from "react";
import moment from "moment";
import { Typography } from "@material-tailwind/react";
import { ThemeContext } from "../../../../context/themeContext";

const CurrentAlarms = ({ data }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="dark:bg-gray-900 bg-white/80 backdrop-blur-md p-4 rounded-md shadow-md">
      <div className="flex flex-col w-full">
        {data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Crossroad Name
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Type Name
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Device Name
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Sensor Name
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
                  >
                    Status Error
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      item.statuserror === 2
                        ? "bg-red-200 dark:bg-red-800"
                        : item.statuserror === 1
                        ? "bg-yellow-200 dark:bg-yellow-800"
                        : item.statuserror === 3
                        ? "bg-gray-200 dark:bg-gray-800"
                        : ""
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                  >
                    <td className="text-sm w-[5%] text-center p-4">
                      {index + 1}
                    </td>
                    <td className="text-sm p-4 w-[14%]">
                      <div className="font-bold text-gray-800 dark:text-gray-100">
                        {moment(item.datetime).format("HH:mm:ss")}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {moment(item.datetime).format("DD-MM-YYYY")}
                      </div>
                    </td>
                    <td className="text-sm p-4 w-[14%] text-gray-800 dark:text-gray-100">
                      {item.crossroad_name}
                    </td>
                    <td className="text-sm p-4 w-[14%] text-gray-800 dark:text-gray-100">
                      {item.type_name}
                    </td>
                    <td className="text-sm p-4 w-[14%] text-gray-800 dark:text-gray-100">
                      {item.device_name}
                    </td>
                    <td className="text-sm p-4 w-[14%] text-gray-800 dark:text-gray-100">
                      {item.sensor_name}
                    </td>
                    <td className="text-sm p-4 w-[14%] text-gray-800 dark:text-gray-100">
                      {item.statuserror_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <Typography className="m-4 text-gray-700 dark:text-gray-300">
              No alarms
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAlarms;
