import React from "react";
import { IconButton, ButtonGroup } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log(totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getItemProps = (index) => ({
    className: currentPage === index ? "bg-blue-gray-900 text-white" : "",
    onClick: () => onPageChange(index),
  });

  const next = () => {
    if (currentPage === totalPages) return;
    onPageChange(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <IconButton key={i} {...getItemProps(i)}>
          {i}
        </IconButton>
      );
    }
    return buttons;
  };

  return (
    <ButtonGroup variant="outlined">
      <IconButton onClick={prev}>
        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      {renderPaginationButtons()}
      <IconButton onClick={next}>
        <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </ButtonGroup>
  );
};
export default Pagination;
