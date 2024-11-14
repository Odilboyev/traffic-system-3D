import { IconButton } from "@material-tailwind/react";
import { memo, useCallback, useEffect, useState } from "react";
import { MdHistory } from "react-icons/md";
import { getErrorHistory } from "../../../../api/api.handlers";
import ModalTable from "../../components/modalTable";

const DeviceErrorHistory = ({ activeSidePanel, setActiveSidePanel }) => {
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
  useEffect(() => {
    if (activeSidePanel === "deviceErrorHistory") fetchErrorHistory(1);
  }, [activeSidePanel]);

  return (
    <>
      <ModalTable
        open={activeSidePanel === "deviceErrorHistory"}
        handleOpen={() => {
          setHistoryData([]);
          setHistoryTotalPages(null);
          setActiveSidePanel(null);
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
