import { Checkbox, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

import { updateFilter } from "../../../../../redux/mapSlice";
import { useCallback } from "react";

const FilterControl = ({ t }) => {
  const dispatch = useDispatch();
  const setFilter = useCallback(
    (isDraggableState) => {
      dispatch(updateFilter(isDraggableState));
    },
    [dispatch]
  );
  const filter = useSelector((state) => state.map.filter);
  const filterOptions = Object.keys(filter).map((v, i) => ({
    type: v,
    label: t(v),
  }));
  const isAllChecked = filterOptions.every(({ type }) => filter[type]);

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      const updatedFilter = filterOptions.reduce(
        (acc, { type }) => ({ ...acc, [type]: checked }),
        {}
      );
      setFilter(updatedFilter);
    } else {
      setFilter({ ...filter, [name]: checked });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {[{ type: "all", label: t("all") }, ...filterOptions].map(
          ({ type, label }) => (
            <div key={type} className="hover:bg-blue-gray-700/20 ">
              <Checkbox
                size={"sm"}
                label={
                  <Typography className="text-sm font-medium">
                    {t(label) || label || ""}
                  </Typography>
                }
                ripple={false}
                className="m-0 p-0"
                checked={type === "all" ? isAllChecked : filter[type]}
                onChange={(e) => handleFilterChange(type, e.target.checked)}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FilterControl;
