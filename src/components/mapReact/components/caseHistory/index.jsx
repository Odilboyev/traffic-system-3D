import Control from "react-leaflet-custom-control";
import { IconButton } from "@material-tailwind/react";
import { useState, useCallback, memo } from "react";
import { MdHistory } from "react-icons/md";
import ModalTable from "../modalTable";
import { getErrorHistory } from "../../../../api/api.handlers";
import { t } from "i18next";

const AlarmHistory = () => {
  const [isAlarmHistoryOpen, setIsAlarmHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);

  // fetchErrorHistory
  const fetchErrorHistory = useCallback(async (current) => {
    setHistoryLoading(true);
    try {
      const all = await getErrorHistory(current);
      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
    } catch (err) {
      console.log("Error fetching error history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);
  return (
    <>
      <IconButton
        onClick={() => setIsAlarmHistoryOpen(!isAlarmHistoryOpen)}
        size="lg"
      >
        <MdHistory className="w-6 h-6 " />
      </IconButton>
      <ModalTable
        open={isAlarmHistoryOpen}
        handleOpen={() => setIsAlarmHistoryOpen(!isAlarmHistoryOpen)}
        data={historyData}
        title={t("history")}
        isLoading={historyLoading}
        itemsPerPage={20}
        totalPages={historyTotalPages}
        fetchHandler={fetchErrorHistory}
      />
    </>
  );
};
export default memo(AlarmHistory);
