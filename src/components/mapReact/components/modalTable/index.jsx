// ModalTable.js
import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Typography } from "@material-tailwind/react";
import { useTheme } from "../../../../customHooks/useTheme";
import { MdSearch } from "react-icons/md";
import { useMap } from "react-leaflet";
import Pagination from "@/components/pagination";
import Loader from "../../../loader";
import Modal from "../../../modal";
import { t } from "i18next";
import FilterTypes from "./filterTypes";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import { shouldHideColumn, getOrderedColumns } from "./utils";
import { useSortedData } from "./useSortedData";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import FormComponent from "./components/FormComponent";

const ModalTable = ({
  open,
  type,
  handleOpen,
  historyButtonCallback,
  selectedFilter,
  filterHandler,
  data = [],
  isLoading,
  totalItems = 0,
  totalPages,
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
  submitNewData,
}) => {
  const { theme } = useTheme();
  const map = useMap();

  const [showTableActions, setShowTableActions] = useState(type !== "history");
  const [typeToShow, settypeToShow] = useState(t(type));
  const [subPageId, setSubPageId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState(null);
  const [isSubPageOpen, setIsSubPageOpen] = useState(false);

  const [editData, setEditData] = useState(null);
  const sortedData = useSortedData(
    data,
    sortedColumn,
    sortOrder,
    searchTerm,
    type == "history" ? selectedFilter : undefined
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
      type === "history"
        ? fetchHandler(page, selectedFilter)
        : fetchHandler(type, page, selectedFilter);
    }
  };

  const handleHeader = (keyName) => {
    setSortOrder(
      sortedColumn === keyName && sortOrder === "asc" ? "desc" : "asc"
    );
    setSortedColumn(keyName);
  };

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

  const slideAnimation = {
    initial: { x: isFormOpen ? "100%" : "-100%" }, // Start outside the viewport
    animate: { x: 0 }, // Slide in from the correct direction
    exit: { x: isFormOpen ? "-100%" : "100%" }, // Exit animation
    transition: { duration: 0.4 }, // Animation speed
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
            }
      }
      title={typeToShow}
      body={
        <div className="h-full w-full no-scrollbar overflow-auto">
          {isFormOpen ? (
            <FormComponent
              type={type}
              data={editData}
              options={tableSelectOptions}
              onSubmit={handleFormSubmit}
              onCancel={() => backButtonProps.onClick(false)}
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

                {!isSubPageOpen && filterOptions && (
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
                {isSubPageOpen || type !== "history" ? (
                  <Button
                    color="blue"
                    onClick={
                      backButtonProps.onClick && !isSubPageOpen
                        ? () => {
                            backButtonProps.onClick(true);
                            setEditData(null);
                            fetchHandler(type, currentPage, 1);
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
                <div className="min-w-full">
                  <table className="w-full border-collapse table-auto  border border-slate-400">
                    <TableHeader
                      columns={columns}
                      showActions={showTableActions}
                      sortedColumn={sortedColumn}
                      isSubPageOpen={isSubPageOpen}
                      sortOrder={sortOrder}
                      onHeaderClick={handleHeader}
                    />
                    <tbody className="overflow-x-scroll font-bold">
                      {sortedData.map((item, i) => (
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
                  <Typography>{t("No data available")}</Typography>
                </div>
              )}
            </>
          )}
        </div>
      }
      footer={
        totalPages > 1 &&
        !isFormOpen && (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )
      }
      typeColor={theme === "dark" ? "white" : "black"}
    />
  );
};

ModalTable.propTypes = {
  open: PropTypes.bool.isRequired,
  showActions: PropTypes.bool,
  type: PropTypes.string,
  handleOpen: PropTypes.func.isRequired,
  historyButtonCallback: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  totalItems: PropTypes.number,
  totalPages: PropTypes.number,
  fetchHandler: PropTypes.func.isRequired,
  pickedFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filterHandler: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type_name: PropTypes.string.isRequired,
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
