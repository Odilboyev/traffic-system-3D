import { IconButton } from "@mui/material";
import React from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  IoMdSunny,
  MdBedtime,
} from "react-icons/md";
import Control from "../../../../components/customControl";

const ControlButtons = ({
  theme,
  toggleTheme,
  toggleFullScreen,
  isFullScreen,
}) => {
  return (
    <>
      <Control position="topleft">
        <IconButton size="lg" onClick={toggleFullScreen}>
          {isFullScreen ? (
            <ArrowsPointingInIcon className="w-8 h-8 p-1" />
          ) : (
            <ArrowsPointingOutIcon className="w-8 h-8 p-1" />
          )}
        </IconButton>
      </Control>
      <Control position="topleft">
        <IconButton size="lg" onClick={toggleTheme}>
          {theme === "light" ? (
            <MdBedtime className="w-7 h-7 p-1" />
          ) : (
            <IoMdSunny className="w-7 h-7 p-1" />
          )}
        </IconButton>
      </Control>
    </>
  );
};

export default ControlButtons;
