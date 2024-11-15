import { Checkbox, Typography } from "@material-tailwind/react";

import PropTypes from "prop-types";
import { useMapMarkers } from "../../../hooks/useMapMarkers";

const WidgetControl = ({ t }) => {
  const { widgets, setWidgets, isDraggable, setIsDraggable } = useMapMarkers();
  const filterOptions = [
    { type: "all", label: t("all") },
    { type: "weather", label: t("weather") },
    { type: "bottomsection", label: t("devices") },
    { type: "crossroad", label: t("crossroad") },
  ];

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      setWidgets({
        bottomsection: checked,
        weather: checked,
        crossroad: checked,
      });
    } else {
      setWidgets((prevWidgets) => ({ ...prevWidgets, [name]: checked }));
    }
  };

  return (
    <div className="p-4 flex flex-col">
      <Typography className="text-sm mb-2 text-white ">
        {t("settings") || ""}
      </Typography>
      <Checkbox
        label={
          <Typography className="text-white ">
            {t("draggable") || ""}
          </Typography>
        }
        ripple={false}
        checked={isDraggable}
        onChange={(e) => setIsDraggable(e.target.checked)}
      />
      <div className="text-sm mb-2"></div>
      <Typography className=" text-sm text-white ">
        {t("widgets") || ""}
      </Typography>
      <div className="flex flex-col w-full">
        {filterOptions.map(({ type, label }) => (
          <Checkbox
            key={type}
            label={
              <Typography className="text-white">{t(label) || ""}</Typography>
            }
            ripple={false}
            className="m-0 p-0"
            checked={
              type === "all"
                ? widgets.weather && widgets.bottomsection && widgets.crossroad
                : widgets[type]
            }
            onChange={(e) => handleFilterChange(type, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
};

WidgetControl.propTypes = {
  activeSidePanel: PropTypes.string,
  setActiveSidePanel: PropTypes.func,
  isDraggable: PropTypes.bool,
  setIsDraggable: PropTypes.func,
  widgets: PropTypes.object,
  setWidgets: PropTypes.func,
  t: PropTypes.func,
};

export default WidgetControl;
