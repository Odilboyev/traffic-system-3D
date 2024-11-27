import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import { memo } from "react";

const Modal = ({
  title,
  size,
  height,
  handleOpen,
  open,
  body,
  footer,
  ...rest
}) => {
  return (
    <Dialog
      size={size || "xxl"}
      open={open}
      handler={handleOpen}
      className="dark:bg-gray-900 dark:!text-white text-gray-900 overflow-hidden"
      {...rest}
    >
      <DialogHeader className="justify-between">
        <div>
          <Typography variant="h5" className="dark:text-white">
            {title || ""}
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
      <DialogBody
        className={` ${height ? height : "h-screen"}  overflow-hidden py-0 `}
      >
        {body}
      </DialogBody>
      {footer && (
        <DialogFooter className="flex justify-center items-center mt-auto backdrop-blur-lg bg-white/20 dark:bg-gray-900/50 absolute -bottom-1 w-full">
          {footer}
        </DialogFooter>
      )}
    </Dialog>
  );
};

export default memo(Modal);
