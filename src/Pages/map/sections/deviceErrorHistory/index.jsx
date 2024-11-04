import { IconButton } from "@material-tailwind/react";
import { useState, useCallback, memo, useEffect } from "react";
import { MdHistory } from "react-icons/md";
import ModalTable from "../../components/modalTable";
import { getErrorHistory } from "../../../../api/api.handlers";
import { t } from "i18next";

const DeviceErrorHistory = () => {
  const [isAlarmHistoryOpen, setIsAlarmHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);
  // fetchErrorHistory
  const fetchErrorHistory = useCallback(async (current, type) => {
    setHistoryLoading(true);
    try {
      const all = await getErrorHistory(current, { type });
      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      throw new Error(err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  return (
    <>
      <IconButton
        onClick={() => {
          setIsAlarmHistoryOpen(!isAlarmHistoryOpen);
          fetchErrorHistory(1);
        }}
        size="lg"
      >
        <MdHistory className="w-6 h-6 " />
      </IconButton>
      <ModalTable
        open={isAlarmHistoryOpen}
        handleOpen={() => {
          setHistoryData([]);
          setHistoryTotalPages(null);
          setIsAlarmHistoryOpen(!isAlarmHistoryOpen);
        }}
        selectedFilter={selectedFilter}
        filterOptions={[
          { type: null, type_name: "all" },
          { type: 1, type_name: "camera" },
          { type: 3, type_name: "boxcontroller" },
          { type: 4, type_name: "svetofor" },
        ]}
        filterHandler={setSelectedFilter}
        data={historyData}
        type={"history"}
        totalItems={totalItems}
        isLoading={historyLoading}
        itemsPerPage={20}
        totalPages={historyTotalPages}
        fetchHandler={fetchErrorHistory}
      />
    </>
  );
};
export default memo(DeviceErrorHistory);
