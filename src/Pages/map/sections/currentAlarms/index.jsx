import { Typography } from "@material-tailwind/react";
import { useEffect, useState, useCallback, memo } from "react";
import moment from "moment";
import ModalTable from "../../components/modalTable"; // Reusing the same ModalTable component
import { getCurrentAlarms } from "../../../../api/api.handlers"; // Assuming you have an API handler

const CurrentAlarms = ({ activeSidePanel, setActiveSidePanel }) => {
  const [alarmData, setAlarmData] = useState([]);
  const [alarmLoading, setAlarmLoading] = useState(false);
  const [alarmTotalPages, setAlarmTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // fetchCurrentAlarms
  const fetchCurrentAlarms = useCallback(async (current, filter) => {
    setAlarmLoading(true);
    try {
      const all = await getCurrentAlarms(current, { type: filter });
      setAlarmData(all.data);
      setAlarmTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      throw new Error(err);
    } finally {
      setAlarmLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSidePanel === "currentAlarms")
      fetchCurrentAlarms(1, selectedFilter);
  }, [activeSidePanel, selectedFilter]);

  return (
    <ModalTable
      open={activeSidePanel === "currentAlarms"}
      handleOpen={() => {
        setAlarmData([]);
        setAlarmTotalPages(null);
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
      data={alarmData}
      type={"currentAlarms"}
      totalItems={totalItems}
      isLoading={alarmLoading}
      itemsPerPage={20}
      totalPages={alarmTotalPages}
      fetchHandler={fetchCurrentAlarms}
    />
  );
};

export default memo(CurrentAlarms);
