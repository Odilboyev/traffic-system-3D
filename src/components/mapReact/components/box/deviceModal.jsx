import React, { useMemo, useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
  CardBody,
  Card,
  Button,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import SensorCard from "./sensorCard";
import Loader from "../../../loader";
import Chart from "react-apexcharts";
import moment from "moment";
import { useTheme } from "../../../../customHooks/useTheme";
import { t } from "i18next";
import {
  getBoxSensorChart,
  getErrorHistory,
} from "../../../../api/api.handlers";
import StatusBadge from "../../../statusBadge";
import { useMap } from "react-leaflet";
import { MapIcon } from "@heroicons/react/16/solid";
import { FaLocationDot } from "react-icons/fa6";
import FilterTypes from "../modalTable/filterTypes";
import SensorSection from "../sensorSection";
import SensorPartWrapper from "../sensorSection/wrapper";
import useSensorErrorHistory from "../../../../customHooks/useSensorHistory";

const hiddenCols = ["type", "type_name", "device_id", "statuserror_name"];

const DeviceModal = ({ isDialogOpen, handler, isLoading, device }) => {
  const { filteredData } = useSensorErrorHistory();
  return (
    <Dialog
      size="xxl"
      open={isDialogOpen}
      handler={handler}
      className="dark:bg-blue-gray-900 dark:text-white"
    >
      <DialogHeader className="justify-end">
        <IconButton size="sm" onClick={handler}>
          <IoMdClose className="w-5 h-5 p-1" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-scroll flex gap-2 max-h-[90vh] no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : filteredData ? (
          <>
            <SensorPartWrapper device={device} />
          </>
        ) : (
          <Typography>No device data</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default DeviceModal;
