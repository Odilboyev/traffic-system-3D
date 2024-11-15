import { Checkbox, Typography } from "@material-tailwind/react";

import { useMapMarkers } from "../../../hooks/useMapMarkers";

const FilterControl = ({ t }) => {
  const { filter, setFilter } = useMapMarkers();
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
      setFilter({
        box: checked,
        crossroad: checked,
        trafficlights: checked,
        camera: checked,
        cameraview: checked,
        camerapdd: checked,
        signs: checked,
      });
    } else {
      setFilter((prevFilter) => ({ ...prevFilter, [name]: checked }));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {filterOptions.map(({ type, label }) => (
          <div key={type} className="hover:bg-blue-gray-700/20 rounded-md">
            <Checkbox
              size={"sm"}
              label={
                <Typography className="text-white text-sm">
                  {t(label) || label || ""}
                </Typography>
              }
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
          </div>
        ))}
      </div>
    </>
  );
};

export default FilterControl;
