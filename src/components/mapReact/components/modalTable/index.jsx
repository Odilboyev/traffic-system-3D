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
import { shouldHideColumn } from "./utils";
import { useSortedData } from "./useSortedData";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";

const ModalTable = ({
  open,
  showActions,
  title,
  handleOpen,
  itemCallback,
  pickedFilter,
  changePickFilter,
  data = [],
  isLoading,
  totalItems = 0,
  totalPages,
  fetchHandler,
  typeOptions = [
    { type: null, type_name: "all" },
    { type: 1, type_name: "camera" },
    { type: 3, type_name: "boxcontroller" },
    { type: 4, type_name: "svetofor" },
  ],
  backButtonProps = {
    label: "back",
    onClick: null,
    icon: <ChevronLeftIcon className="w-5 h-5 m-0" />,
  },
}) => {
  const encryptedRole = atob(localStorage.getItem("its_user_role"));
  const { theme } = useTheme();
  const map = useMap();

  const [showTableActions, setShowTableActions] = useState(showActions);
  const [titleToShow, setTitleToShow] = useState(t(title || "history"));
  const [subPageId, setSubPageId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isSubPageOpen, setIsSubPageOpen] = useState(false);

  const sortedData = useSortedData(
    data,
    sortedColumn,
    sortOrder,
    searchTerm,
    title != "users" && selectedFilter
  );
  useEffect(() => {
    setTitleToShow(t(title));
    setSelectedFilter(pickedFilter || typeOptions[0]?.type);
  }, [title, open]);

  useEffect(() => {
    if (open && isSubPageOpen) {
      itemCallback(currentPage, title, subPageId);
    }
  }, [currentPage, open, selectedFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchHandler(page, selectedFilter);
  };

  const handleHeader = (keyName) => {
    setSortOrder(
      sortedColumn === keyName && sortOrder === "asc" ? "desc" : "asc"
    );
    setSortedColumn(keyName);
  };

  const locationHandler = (lat, lng) => {
    if (lat && lng) map.flyTo([lat, lng], 20);
    handleOpen();
  };

  const historyHandler = (item) => {
    setShowTableActions(false);
    setCurrentPage(1);
    setIsSubPageOpen(true);
    itemCallback(1, title, item.id);
    setSubPageId(item.id);
    setTitleToShow(`${t("history")} - ${t(title)} ${"- " + item.name}`);
  };

  const columns = data?.[0]
    ? Object.keys(data[0]).filter(
        (key) =>
          !shouldHideColumn(key, isSubPageOpen, selectedFilter, itemCallback)
      )
    : [];

  return (
    <Modal
      open={open}
      handleOpen={() => {
        handleOpen();
        setIsSubPageOpen(false);
        setTitleToShow("");
        setCurrentPage(1);
      }}
      title={titleToShow}
      body={
        <>
          <div className="flex justify-between w-full py-3">
            <div className={`flex ${itemCallback ? "w-2/6" : "w-4/6"} gap-5`}>
              <Input
                aria-label={t("search_input")}
                color={theme === "dark" ? "white" : "black"}
                label={t("search")}
                value={searchTerm}
                className="dark:focus:!border-b-white border-b-black"
                icon={<MdSearch className="dark:text-white" />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {!itemCallback || title === "users" ? (
                <FilterTypes
                  typeOptions={typeOptions}
                  active={selectedFilter}
                  valueKey="type"
                  nameKey="type_name"
                  onFilterChange={(selectedType) => {
                    setSelectedFilter(selectedType);
                    changePickFilter(selectedType);
                    setCurrentPage(1);
                    title == "users"
                      ? fetchHandler("user/" + selectedType, 1)
                      : fetchHandler(1, selectedType);
                  }}
                />
              ) : null}
            </div>
            {isSubPageOpen || title === "users" ? (
              <Button
                color="blue"
                onClick={
                  backButtonProps.onClick
                    ? backButtonProps.onClick
                    : () => {
                        setTitleToShow(t(title));
                        fetchHandler(title, currentPage);
                        setShowTableActions(true);
                        setIsSubPageOpen(false);
                        console.log("bakc clicked", currentPage, title);
                      }
                }
                className="flex gap-2 items-center"
              >
                {backButtonProps.icon}
                <p>{t(backButtonProps.label)}</p>
              </Button>
            ) : null}
          </div>
          {isLoading ? (
            <Loader />
          ) : sortedData.length > 0 ? (
            <table className="w-full table-auto overflow-x-scroll border border-slate-400">
              <TableHeader
                columns={columns}
                sortedColumn={sortedColumn}
                isSubPageOpen={isSubPageOpen}
                sortOrder={sortOrder}
                onHeaderClick={handleHeader}
              />
              <tbody className="overflow-x-scroll font-bold">
                {sortedData.map((item, i) => (
                  <TableRow
                    key={i}
                    title={title}
                    item={item}
                    columns={columns}
                    showActions={showTableActions}
                    isSubPageOpen={isSubPageOpen}
                    locationHandler={locationHandler}
                    historyHandler={historyHandler}
                    encryptedRole={encryptedRole}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-[30vh]">
              <Typography>{t("nodata")}</Typography>
            </div>
          )}
        </>
      }
      footer={
        totalPages > 1 && (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )
      }
      titleColor={theme === "dark" ? "white" : "black"}
    />
  );
};

ModalTable.propTypes = {
  open: PropTypes.bool.isRequired,
  showActions: PropTypes.bool,
  title: PropTypes.string,
  handleOpen: PropTypes.func.isRequired,
  itemCallback: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  totalItems: PropTypes.number,
  totalPages: PropTypes.number,
  fetchHandler: PropTypes.func.isRequired,
  pickedFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changePickFilter: PropTypes.func,
  typeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type_name: PropTypes.string.isRequired,
    })
  ),

  backButtonProps: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
};

export default memo(ModalTable);
