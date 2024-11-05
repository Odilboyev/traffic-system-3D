import { ListBulletIcon } from "@heroicons/react/16/solid";
import { Checkbox, IconButton, Typography } from "@material-tailwind/react";
import { t } from "i18next";
import React from "react";
import SidePanel from "../../../../../components/sidePanel";

const FilterControl = ({
  activeSidePanel,
  setActiveSidePanel,
  changeFilter,
  filter,
}) => {
  const filterOptions = [
    { type: "all", label: t("all") },
    { type: "box", label: t("boxcontroller") },
    { type: "camera", label: t("camera") },
    { type: "cameraview", label: t("cameraview") },
    { type: "camerapdd", label: t("camerapdd") },
    { type: "crossroad", label: t("crossroad") },
    { type: "trafficlights", label: t("svetofor") },
    { type: "signs", label: t("signs") },
  ];

  const handleFilterChange = (name, checked) => {
    if (name === "all") {
      changeFilter({
        box: checked,
        crossroad: checked,
        trafficlights: checked,
        camera: checked,
        cameraview: checked,
        camerapdd: checked,
        signs: checked,
      });
    } else {
      changeFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  const filterContent = (
    <div className="p-2 flex flex-col gap-2">
      {filterOptions.map(({ type, label }) => (
        <Checkbox
          key={type}
          label={<Typography className="text-white">{t(label)}</Typography>}
          ripple={false}
          className="m-0 p-0"
          checked={
            type === "all"
              ? filter.box &&
                filter.crossroad &&
                filter.trafficlights &&
                filter.camera &&
                filter.cameraview &&
                filter.camerapdd &&
                filter.signs
              : filter[type]
          }
          onChange={(e) => handleFilterChange(type, e.target.checked)}
        />
      ))}
    </div>
  );

  return (
    <>
      <IconButton
        size="lg"
        onClick={() =>
          setActiveSidePanel(activeSidePanel === "filter" ? null : "filter")
        }
      >
        <ListBulletIcon className="w-5 h-5" />
      </IconButton>
      <SidePanel
        sndWrapperClass="min-w-[15vw]"
        title={t("filters")}
        isOpen={activeSidePanel === "filter"}
        setIsOpen={() => setActiveSidePanel(null)}
        content={filterContent}
      />
    </>
  );
};

export default FilterControl;
