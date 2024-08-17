import Control from "react-leaflet-custom-control";
import {
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { CogIcon } from "@heroicons/react/16/solid";
import HistoryTable from "../caseHistory/all.casehistory";
import { getCaseHistory } from "../../../../api/apiHandlers";
import { useState, useCallback } from "react";
import { t } from "i18next";
import Dropright from "../../../Dropright";

const AlarmHistory = () => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [historyType, setHistoryType] = useState("all"); // default type
  const [isAlarmHistoryOpen, setIsAlarmHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);

  const fetchErrorHistory = useCallback(async (type, current) => {
    setHistoryLoading(true);
    try {
      const all = await getCaseHistory(type, current);
      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
    } catch (err) {
      console.log("Error fetching error history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Handler for changing the history type
  const handleTypeChange = (type) => {
    setIsDroprightOpen(false); // Close the dropdown
    setHistoryType(type);
    setIsAlarmHistoryOpen(true);
    fetchErrorHistory(type, 1); // Fetch data for the selected type
  };

  return (
    <Control position="topleft">
      <IconButton
        onClick={() => setIsDroprightOpen(!isDroprightOpen)}
        size="lg"
      >
        <CogIcon className="w-6 h-6 " />
      </IconButton>
      <Dropright
        wrapperClass="relative inline-block text-left"
        sndWrapperClass="ml-3 -top-8 absolute rounded-md dark:bg-gray-900/70 text-blue-gray-900 dark:text-white bg-white/70 backdrop-blur-md"
        isOpen={isDroprightOpen}
        setIsOpen={setIsDroprightOpen}
        content={
          <div className="p-4 rounded-lg flex flex-col justify-center items-center">
            <Typography>{t("history")}</Typography>
            <List className="dark:text-white">
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("all")}
              >
                {t("all")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("crossroad")}
              >
                {t("crossroad")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("camera")}
              >
                {t("camera")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("boxcontroller")}
              >
                {t("boxcontroller")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("trafficlight")}
              >
                {t("svetofor")}
              </ListItem>
            </List>
          </div>
        }
      />
      <HistoryTable
        open={isAlarmHistoryOpen}
        type={historyType}
        handleOpen={() => setIsAlarmHistoryOpen(!isAlarmHistoryOpen)}
        data={historyData}
        isLoading={historyLoading}
        itemsPerPage={20}
        historyTotalPages={historyTotalPages}
        fetchErrorHistory={fetchErrorHistory}
      />
    </Control>
  );
};
export default AlarmHistory;
