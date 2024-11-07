import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ButtonGroup, IconButton, Typography } from "@material-tailwind/react";
import { t } from "i18next";
import { useTheme } from "../../customHooks/useTheme";
import CustomSelect from "../customSelect";

const Pagination = ({
  currentPage,
  totalItems,
  onPageChange,
  itemsPerPage = 10,
  handleItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Items per page options
  const itemsPerPageOptions = [
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  const getItemProps = (index) => ({
    className:
      currentPage === index
        ? "bg-blue-gray-900 text-white dark:bg-white/60 dark:text-blu-gray-900"
        : "",
    onClick: () => onPageChange(index),
  });

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <IconButton key="start-ellipsis" disabled>
          ...
        </IconButton>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <IconButton key={i} {...getItemProps(i)}>
          {i}
        </IconButton>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <IconButton key="end-ellipsis" disabled>
          ...
        </IconButton>
      );
    }

    return pageNumbers;
  };

  const next = () => {
    if (currentPage === totalPages) return;
    onPageChange(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  const goToFirstPage = () => {
    onPageChange(1);
  };

  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Typography className="text-sm">{t("items_per_page")}:</Typography>
          <CustomSelect
            value={itemsPerPageOptions.find(
              (option) => option.value === itemsPerPage
            )}
            placeholder={t("select")}
            onChange={(value) => handleItemsPerPageChange(value.value)}
            className="w-20"
            options={itemsPerPageOptions.map((value) => ({
              value: value.value.toString(),
              label: value.label,
            }))}
            menuPlacement="top"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </div>
        <Typography className="text-right">
          {t("total")}:{" "}
          <b className="dark:text-white text-black">{totalItems}</b>
        </Typography>
      </div>

      <div className="flex justify-center">
        <ButtonGroup
          variant="outlined"
          color={theme === "light" ? "black" : "white"}
          className="dark:border-white dark:text-white"
        >
          <IconButton onClick={goToFirstPage} disabled={isFirstPage}>
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={prev} disabled={isFirstPage}>
            <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          {getPageNumbers()}
          <IconButton onClick={next} disabled={isLastPage}>
            <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={goToLastPage} disabled={isLastPage}>
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </IconButton>
        </ButtonGroup>
      </div>

      <Typography className="text-center text-sm">
        {t("showing")}{" "}
        {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} {t("of")}{" "}
        {totalItems} {t("items")}
      </Typography>
    </div>
  );
};

export default Pagination;
