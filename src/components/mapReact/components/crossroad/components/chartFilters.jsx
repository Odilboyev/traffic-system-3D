import React from "react";
import DatePicker from "../../../../datePicker";
import { Option, Select } from "@material-tailwind/react";

const ChartFilters = ({ time, timeHandler, interval, intervalHandler }) => {
  return (
    <div className="max-w-full flex gap-2 p-2 rounded-b fixed !bg-white z-50">
      <DatePicker date={time} dateHandler={timeHandler} label={"Sana"} />
      <Select
        label="Interval"
        onChange={(e) => intervalHandler(e)}
        value={interval}
      >
        {intervals.map((v, i) => (
          <Option value={v} key={i}>
            {v > 60 ? `${Math.floor(v / 60)} hours` : `${v} min`}
          </Option>
        ))}
      </Select>
    </div>
  );
};
const intervals = [1, 5, 15, 30, 60, 120, 180, 240];
export default ChartFilters;
