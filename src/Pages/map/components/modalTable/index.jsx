import { Button, Input, Typography } from "@material-tailwind/react";
import { getOrderedColumns, shouldHideColumn } from "./utils";
import { memo, useEffect, useState } from "react";

import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import FilterTypes from "./filterTypes";
import FormComponent from "./components/FormComponent";
import Loader from "../../../../components/loader";
import { MdSearch } from "react-icons/md";
import Modal from "../../../../components/modal";
import Pagination from "../../../../components/pagination";
// ModalTable.js
import PropTypes from "prop-types";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import { ToastContainer } from "react-toastify";
import { t } from "i18next";
import useLocalStorageState from "../../../../customHooks/uselocalStorageState";
import { useMap } from "react-leaflet";
import { useSortedData } from "./useSortedData";
import { useTheme } from "../../../../customHooks/useTheme";

const ModalTable = ({
  open,
  type,
  handleOpen,
  historyButtonCallback,
  selectedFilter,
  filterHandler,
  data = [],
  isLoading,
  fetchHandler,
  filterOptions,
  backButtonProps = {
    label: "back",
    onClick: null,
    icon: <ChevronLeftIcon className="w-5 h-5 m-0" />,
  },
  deleteButtonCallback = () => {},
  editButtonCallback = () => {},
  activateButtonCallback = () => {},
  tableDataCallback = () => {},
  tableSelectOptions,
  isFormOpen,
  setIsEditing,
  submitNewData,
}) => {
  const { theme } = useTheme();

  const [showTableActions, setShowTableActions] = useState(
    type !== "history" && type !== "currentAlarms"
  );
  const [typeToShow, settypeToShow] = useState(t(type));
  const [subPageId, setSubPageId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useLocalStorageState(
    "itemsPerPage",
    50
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState(null);
  const [isSubPageOpen, setIsSubPageOpen] = useState(false);

  const [editData, setEditData] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});

  const sortedData = useSortedData(
    data,
    sortedColumn,
    sortOrder,
    searchTerm,
    type == "history" ? selectedFilter : undefined,
    columnFilters
  );
  useEffect(() => {
    settypeToShow(t(type));
    // setSelectedFilter(pickedFilter || filterOptions[0]?.type);
  }, [type, open]);

  // useEffect(() => {
  //   if (open && isSubPageOpen) {
  //     historyButtonCallback(currentPage, type, subPageId);
  //   }
  // }, [currentPage, open, selectedFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (isSubPageOpen) {
      historyButtonCallback(1, type, subPageId);
    } else {
      type === "history" && fetchHandler(selectedFilter);
    }
  };

  const handleHeader = (keyName) => {
    setSortOrder(
      sortedColumn === keyName && sortOrder === "asc" ? "desc" : "asc"
    );
    setSortedColumn(keyName);
  };
  const map = useMap();

  const locationHandler = (lat, lng) => {
    if (lat && lng)
      map.flyTo([lat, lng], 20, {
        animate: true,
        duration: 1,
      });

    handleOpen();
  };

  const historyHandler = (item) => {
    setShowTableActions(false);
    setCurrentPage(1);
    setIsSubPageOpen(true);
    historyButtonCallback(1, type, item.id);
    setSubPageId(item.id);
    settypeToShow(`${t("history")} - ${t(type)} ${"- " + item.name}`);
  };

  const columns = data?.[0]
    ? getOrderedColumns(
        Object.keys(data[0]).filter(
          (key) =>
            !shouldHideColumn(
              key,
              isSubPageOpen,
              selectedFilter,
              historyButtonCallback
            )
        )
      )
    : [];
  const handleFormSubmit = (data) => {
    submitNewData(data);
    backButtonProps.onClick(false); // Return to table view after form submission
  };

  const editHandler = (data) => {
    editButtonCallback(true);
    backButtonProps.onClick(true);
    setEditData(data);
  };

  // Calculate paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    console.log(newItemsPerPage);

    // Reset to first page when changing items per page
    setCurrentPage(1);
  };

  const handleFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <Modal
      open={open}
      handleOpen={
        isFormOpen
          ? () => backButtonProps.onClick(false)
          : () => {
              handleOpen();
              editButtonCallback(false);
              setEditData(null);
              setIsSubPageOpen(false);
              settypeToShow("");
              setCurrentPage(1);
              setEditData(null);
              setIsEditing(false);
            }
      }
      title={typeToShow}
      body={
        <div className="h-full w-full pb-20 no-scrollbar overflow-auto ">
          {isFormOpen ? (
            <FormComponent
              type={type}
              data={editData}
              options={tableSelectOptions}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                backButtonProps.onClick(false);
                setEditData(null);
                setIsEditing(false);
              }}
              t={t}
            />
          ) : (
            <>
              <ToastContainer
                containerId="modal"
                style={{ zIndex: 99999 }}
                position="bottom-right" // Set the position to bottom-right
                autoClose={3000} // Auto close after 3 seconds
                hideProgressBar={false}
                closeOnClick
                draggable
                theme="colored"
                pauseOnHover
              />
              <div className="flex justify-between w-full py-3 mb-2">
                <div
                  className={`flex ${
                    type !== "history" ? "w-2/6" : "w-3/6"
                  } gap-5`}
                >
                  <Input
                    aria-label={t("search_input")}
                    color={theme === "dark" ? "white" : "black"}
                    label={t("search")}
                    value={searchTerm}
                    className="dark:focus:!border-b-white border-b-black"
                    icon={<MdSearch className="dark:text-white" />}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {!isSubPageOpen &&
                  filterOptions &&
                  type !== "currentAlarms" && (
                    <FilterTypes
                      filterOptions={filterOptions}
                      active={selectedFilter}
                      valueKey="type"
                      nameKey="type_name"
                      onFilterChange={(selectedType) => {
                        filterHandler(selectedType);
                        type === "history" && fetchHandler(1, selectedType); // using historyhandler when using history
                        setCurrentPage(1);
                        // type == "users"
                        //   ? fetchHandler("user/" + selectedType, 1)
                        //   : type == "crossroad"
                        //   ? fetchHandler(type, 1, selectedType)
                        //   : fetchHandler(1, selectedType);
                      }}
                    />
                  )}
                {isSubPageOpen ||
                (type !== "history" && type !== "currentAlarms") ? (
                  <Button
                    color="blue"
                    onClick={
                      backButtonProps.onClick && !isSubPageOpen
                        ? () => {
                            backButtonProps.onClick(true);
                            setEditData(null);
                            fetchHandler(type, 1);
                          }
                        : () => {
                            settypeToShow(t(type));
                            fetchHandler(type, currentPage, 1);
                            setShowTableActions(true);
                            setIsSubPageOpen(false);
                          }
                    }
                    className="flex gap-2 items-center"
                  >
                    {backButtonProps.onClick && !isSubPageOpen ? (
                      <>
                        {" "}
                        {backButtonProps.icon}
                        <p>{t(backButtonProps.label)}</p>
                      </>
                    ) : (
                      <>
                        {" "}
                        <ChevronLeftIcon className="w-5 h-5 m-0" />
                        {t("back")}
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
              {isLoading ? (
                <Loader />
              ) : sortedData.length > 0 ? (
                <div className="w-full max-w-screen overflow-x-scroll no-scrollbar">
                  <table className="w-full border-collapse table-auto  border border-slate-400">
                    <TableHeader
                      columns={columns}
                      data={data}
                      showActions={showTableActions}
                      sortedColumn={sortedColumn}
                      isSubPageOpen={isSubPageOpen}
                      sortOrder={sortOrder}
                      onHeaderClick={handleHeader}
                      onFilterChange={handleFilterChange}
                    />
                    <tbody className="overflow-x-scroll font-bold">
                      {getPaginatedData().map((item, i) => (
                        <TableRow
                          key={i}
                          type={type}
                          item={item}
                          selectedFilter={selectedFilter}
                          columns={columns}
                          showActions={showTableActions}
                          isSubPageOpen={isSubPageOpen}
                          locationHandler={locationHandler}
                          historyHandler={historyHandler}
                          deleteButtonCallback={deleteButtonCallback}
                          editButtonCallback={editHandler}
                          activateButtonCallback={activateButtonCallback}
                          tableDataCallback={tableDataCallback}
                          tableSelectOptions={tableSelectOptions}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[30vh]">
                  <Typography>{t("no_data_found") || ""}</Typography>
                </div>
              )}
            </>
          )}
        </div>
      }
      footer={
        !isFormOpen && (
          <Pagination
            totalItems={sortedData.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            onPageChange={handlePageChange}
          />
        )
      }
      typeColor={theme === "dark" ? "white" : "black"}
    />
  );
};

ModalTable.propTypes = {
  open: PropTypes.bool,
  showActions: PropTypes.bool,
  type: PropTypes.string,
  handleOpen: PropTypes.func,
  historyButtonCallback: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  fetchHandler: PropTypes.func,
  pickedFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filterHandler: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type_name: PropTypes.string,
    })
  ),

  backButtonProps: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  deleteButtonCallback: PropTypes.func,
  editButtonCallback: PropTypes.func,
  activateButtonCallback: PropTypes.func,
  tableDataCallback: PropTypes.func,
  tableSelectOptions: PropTypes.array,
};

export default memo(ModalTable);
