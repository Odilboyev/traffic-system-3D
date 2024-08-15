import { useContext } from "react";
import { IconButton, ButtonGroup } from "@material-tailwind/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../../customHooks/useTheme";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

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
  );
};

export default Pagination;
