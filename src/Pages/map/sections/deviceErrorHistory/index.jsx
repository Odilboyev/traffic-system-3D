import { memo, useCallback, useEffect, useState } from "react";

import ModalTable from "../../components/modalTable";
import { getErrorHistory } from "../../../../api/api.handlers";
import { useSelector } from "react-redux";

const DeviceErrorHistory = ({ activeSidePanel, setActiveSidePanel }) => {
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyTotalPages, setHistoryTotalPages] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);
  // fetchErrorHistory
  const fetchErrorHistory = useCallback(async (current, type) => {
    setHistoryLoading(true);
    try {
      const all = await getErrorHistory(current, { type });
      setHistoryData(all.data);
      setHistoryTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
      setItemsPerPage(all.per_page_items);
    } catch (err) {
      throw new Error(err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);
  useEffect(() => {
    if (activeSidePanel === "deviceErrorHistory") fetchErrorHistory(1);
  }, [activeSidePanel]);

  const filterOptions = useSelector(
    (state) => state.map.filterOptionsWithTypes
  );
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
        filterOptions={[{ name: "all", type: null }, ...filterOptions].filter(
          (item) => item.type !== 2
        )}
        totalPageProp={historyTotalPages}
        nameKeyOfFilter="name"
        valueKeyOfFilter="type"
        filterHandler={setSelectedFilter}
        data={historyData}
        itemsPerPageProp={itemsPerPage}
        type={"history"}
        totalItemsProp={totalItems}
        isLoading={historyLoading}
        itemsPerPage={20}
        totalPages={historyTotalPages}
        fetchHandler={fetchErrorHistory}
      />
    </>
  );
};
export default memo(DeviceErrorHistory);
