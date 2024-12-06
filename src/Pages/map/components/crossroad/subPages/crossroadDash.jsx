import * as XLSX from "xlsx";

import {
  Button,
  Input,
  Spinner,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { FaChartBar, FaTable } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  getCrossRoadStats,
  getTrafficStatsData,
} from "../../../../../api/api.handlers";

import CrossroadStats from "./newChart";
import { t } from "i18next";

const CrossroadDashboard = ({ marker }) => {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });
  const [currentMode, setCurrentMode] = useState("chart");
  const [tableData, setTableData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchStatsForTable(newDate);
  };
  const fetchStats = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await getCrossRoadStats({ crossroad_id: marker?.cid });
      setState((prev) => ({
        ...prev,
        data: response,
        lastUpdated: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching crossroad stats:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to load crossroad statistics",
        isLoading: false,
      }));
    }
  };

  const fetchStatsForTable = async (date = selectedDate) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await getTrafficStatsData(marker?.cid, { date });
      setTableData(response);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Error fetching crossroad stats:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to load crossroad statistics",
        isLoading: false,
      }));
    }
  };
  const exportToExcel = () => {
    if (!tableData) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add summary sheet for all directions
    const allDirectionsData = tableData.all_direction_data.slice(1); // Skip header row
    const summaryWs = XLSX.utils.json_to_sheet(allDirectionsData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "All Directions");

    // Add sheets for each direction
    tableData.by_direction_data.forEach((direction, index) => {
      const directionData = direction.data.slice(1); // Skip header row
      const ws = XLSX.utils.json_to_sheet(directionData);

      // Create a shortened sheet name
      let sheetName = direction.direction_name;
      if (sheetName.length > 28) {
        // If name is too long, truncate it and add direction number
        sheetName = `${sheetName.substring(0, 25)}...${index + 1}`;
      }

      // Ensure sheet name is unique and within length limit
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    });

    // Save file
    XLSX.writeFile(wb, `crossroad-${marker.cid}-traffic-stats.xlsx`);
  };

  useEffect(() => {
    if (marker?.cid) {
      if (currentMode === "chart") {
        fetchStats();
      } else {
        fetchStatsForTable();
      }
    }
  }, [marker?.cid, currentMode]);

  const { data, isLoading, error, lastUpdated } = state;

  // Fetch stats for the selected date
  useEffect(() => {
    if (marker?.cid) {
      if (currentMode === "chart") {
        fetchStats();
      } else {
        fetchStatsForTable(selectedDate);
      }
    }
  }, [marker?.cid, currentMode, selectedDate]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getPreviousDay = (date) => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    return prevDate.toISOString().split("T")[0];
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        <button
          onClick={() => {
            currentMode === "chart" ? fetchStats() : fetchStatsForTable();
          }}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!data && !tableData) {
    return (
      <div className="p-4  dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-white text-medium text-sm">
          No statistics available for this crossroad
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg dark:text-white text-medium font-semibold">
          Crossroad Statistics
        </h3>
        <div className="flex items-center gap-4">
          <Tabs value={currentMode} className="w-fit">
            <TabsHeader>
              <Tab value="chart" onClick={() => setCurrentMode("chart")}>
                <div className="flex items-center gap-2">
                  <FaChartBar />
                  {t("chart")}
                </div>
              </Tab>
              <Tab value="table" onClick={() => setCurrentMode("table")}>
                <div className="flex items-center gap-2">
                  <FaTable />
                  {t("table")}
                </div>
              </Tab>
            </TabsHeader>
          </Tabs>
        </div>
      </div>

      {currentMode === "chart" ? (
        <CrossroadStats crossroadStats={state.data} />
      ) : (
        <>
          <div className="flex w-full justify-between items-center">
            {currentMode === "table" && (
              <div className="mb-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-1/3"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
            )}
            {currentMode === "table" && tableData && (
              <Button
                size="sm"
                color="green"
                variant="outlined"
                className="flex items-center gap-2 mb-4"
                onClick={exportToExcel}
              >
                {t("Export to Excel")}
              </Button>
            )}
          </div>

          {isLoading && (
            <div className="">
              <Spinner className="h-4 w-4" />
            </div>
          )}

          <div className="overflow-x-auto">
            {tableData && (
              <Tabs value={activeTab} className="w-full">
                <TabsHeader>
                  <Tab
                    key="all"
                    value="all"
                    onClick={() => setActiveTab("all")}
                    className="px-4 py-2 text-sm h-auto"
                  >
                    {t("all_directions")}
                  </Tab>
                  {tableData.by_direction_data.map((direction) => (
                    <Tab
                      key={direction.direction_id}
                      value={direction.direction_id.toString()}
                      onClick={() =>
                        setActiveTab(direction.direction_id.toString())
                      }
                      className="px-4 py-2 text-sm h-auto"
                    >
                      {direction.direction_name}
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody>
                  <TabPanel key="all" value="all" className="overflow-x-auto">
                    <Typography variant="h6" className="mb-4">
                      {t("all_directions_traffic")}
                    </Typography>
                    <table className="w-full min-w-max table-auto text-left dark:text-white text-medium">
                      <thead>
                        <tr>
                          <th className="border-b border-gray-200  p-4">
                            {t("time_period")}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {t("small_cars")}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {t("medium_cars")}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {t("large_cars")}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(selectedDate)}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(getPreviousDay(selectedDate))}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_2_all
                            )}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_3_all
                            )}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_4_all
                            )}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_5_all
                            )}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_6_all
                            )}
                          </th>
                          <th className="border-b border-gray-200  p-4">
                            {formatDate(
                              tableData.all_direction_data[0]
                                .count_yesterday_7_all
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.all_direction_data
                          .slice(1)
                          .map((row, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200"
                            >
                              <td className="p-4">{`${row.hour_start} - ${row.hour_end}`}</td>
                              <td className="p-4">{row.count_carsmall}</td>
                              <td className="p-4">{row.count_carmid}</td>
                              <td className="p-4">{row.count_carbig}</td>
                              <td className="p-4">{row.count_today_all}</td>
                              <td className="p-4">{row.count_yesterday_all}</td>
                              <td className="p-4">
                                {row.count_yesterday_2_all}
                              </td>
                              <td className="p-4">
                                {row.count_yesterday_3_all}
                              </td>
                              <td className="p-4">
                                {row.count_yesterday_4_all}
                              </td>
                              <td className="p-4">
                                {row.count_yesterday_5_all}
                              </td>
                              <td className="p-4">
                                {row.count_yesterday_6_all}
                              </td>
                              <td className="p-4">
                                {row.count_yesterday_7_all}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </TabPanel>

                  {tableData.by_direction_data.map((direction) => (
                    <TabPanel
                      key={direction.direction_id}
                      value={direction.direction_id.toString()}
                      className="overflow-x-scroll"
                    >
                      <Typography variant="h6" className="mb-4">
                        {direction.direction_name}
                      </Typography>
                      <table className="w-full min-w-max table-auto text-left dark:text-white text-medium">
                        <thead>
                          <tr>
                            <th className="border-b border-gray-200  p-4">
                              {t("time_period")}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {t("small_cars")}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {t("medium_cars")}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {t("large_cars")}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(selectedDate)}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(getPreviousDay(selectedDate))}
                            </th>

                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_2_all
                              )}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_3_all
                              )}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_4_all
                              )}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_5_all
                              )}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_6_all
                              )}
                            </th>
                            <th className="border-b border-gray-200  p-4">
                              {formatDate(
                                direction.data[0].count_yesterday_7_all
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {direction.data.slice(1).map((row, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200 "
                            >
                              <td className="p-4 dark:text-white text-medium">{`${row.hour_start} - ${row.hour_end}`}</td>
                              <td className="p-4 dark:text-white text-medium">
                                <p className="dark:text-white text-medium">
                                  {row.count_carsmall}
                                </p>
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_carmid}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_carbig}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_today_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_2_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_3_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_4_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_5_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_6_all}
                              </td>
                              <td className="p-4 dark:text-white text-medium">
                                {row.count_yesterday_7_all}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CrossroadDashboard;
