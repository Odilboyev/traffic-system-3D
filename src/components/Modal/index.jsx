import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import React, { memo } from "react";

const Modal = ({ title, handleOpen, open, body, bottom, ...rest }) => {
  return (
    <Dialog
      size="xxl"
      open={open}
      handler={handleOpen}
      className="dark:bg-blue-gray-900 dark:!text-white text-blue-gray-900"
      {...rest}
    >
      <DialogHeader className="justify-between">
        <div>
          <Typography variant="h5" className="dark:text-white">
            {title}
          </Typography>
        </div>
        <IconButton
          size="sm"
          variant="text"
          onClick={handleOpen}
          className="dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-scroll !px-5">{body}</DialogBody>
      <DialogFooter className="flex justify-center items-center mt-auto">
        {bottom}
      </DialogFooter>
    </Dialog>
  );
};

export default memo(Modal);
