import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Checkbox, IconButton, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Control from "../../../../../components/customControl";
import SidePanel from "../../../../../components/sidePanel";

const WidgetControl = ({
  activeSidePanel,
  setActiveSidePanel,
  isDraggable,
  setIsDraggable,
  widgets,
  setWidgets,
  t,
}) => {
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
    <Control position="topleft">
      <IconButton
        size="lg"
        onClick={() =>
          setActiveSidePanel(activeSidePanel === "settings" ? null : "settings")
        }
      >
        <Cog8ToothIcon className="w-5 h-5" />
      </IconButton>
      <SidePanel
        title={t("markers")}
        sndWrapperClass="absolute left-full ml-2 no-scrollbar overflow-y-scroll w-[15vw] "
        isOpen={activeSidePanel === "settings"}
        setIsOpen={() => setActiveSidePanel(null)}
        content={
          <div className="p-4 flex flex-col">
            <Typography className="text-sm mb-2 text-white ">
              {t("settings")}
            </Typography>
            <Checkbox
              label={
                <Typography className="text-white ">
                  {t("draggable")}
                </Typography>
              }
              ripple={false}
              checked={isDraggable}
              onChange={(e) => setIsDraggable(e.target.checked)}
            />
            <div className="text-sm mb-2"></div>
            <Typography className=" text-sm text-white ">
              {t("widgets")}
            </Typography>
            <div className="flex flex-col w-full">
              {filterOptions.map(({ type, label }) => (
                <Checkbox
                  key={type}
                  label={
                    <Typography className="text-white">{label}</Typography>
                  }
                  ripple={false}
                  className="m-0 p-0"
                  checked={
                    type === "all"
                      ? widgets.weather &&
                        widgets.bottomsection &&
                        widgets.crossroad
                      : widgets[type]
                  }
                  onChange={(e) => handleFilterChange(type, e.target.checked)}
                />
              ))}
            </div>
          </div>
        }
      />
    </Control>
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
