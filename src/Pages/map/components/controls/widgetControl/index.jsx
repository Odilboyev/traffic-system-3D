import { Checkbox, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import { updateWidgets } from "../../../../../redux/mapSlice";
import { useCallback } from "react";

const WidgetControl = ({ t }) => {
  const widgets = useSelector((state) => state.map.widgets);
  const dispatch = useDispatch();
  const setWidgets = useCallback(
    (newWidgets) => {
      dispatch(updateWidgets(newWidgets));
    },
    [dispatch]
  );
  const filterOptions = Object.keys(widgets).map((v) => ({
    type: v,
    label: t(v),
  }));
  const isAllChecked = filterOptions.every(({ type }) => widgets[type]);

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      const updatedFilter = filterOptions.reduce(
        (acc, { type }) => ({ ...acc, [type]: checked }),
        {}
      );
      setWidgets(updatedFilter);
    } else {
      setWidgets({ ...widgets, [name]: checked });
    }
  };
  return (
    <div className=" flex flex-col">
      <div className="flex flex-col w-full">
        {[{ type: "all", label: t("all") }, ...filterOptions].map(
          ({ type, label }) => (
            <Checkbox
              key={type}
              label={
                <Typography className="text-sm font-medium dark:text-white">
                  {t(label) || ""}
                </Typography>
              }
              ripple={false}
              className="m-0 p-0"
              checked={type === "all" ? isAllChecked : widgets[type]}
              onChange={(e) => handleFilterChange(type, e.target.checked)}
            />
          )
        )}
      </div>
    </div>
  );
};

WidgetControl.propTypes = {
  t: PropTypes.func,
};

export default WidgetControl;
