import { Checkbox, Typography } from "@material-tailwind/react";

import PropTypes from "prop-types";
import { memo } from "react";
import { useMapMarkers } from "../../../hooks/useMapMarkers";

const MarkerControl = memo(({ t }) => {
  const { isDraggable, setIsDraggable, isHighQuality, setIsHighQuality } =
    useMapMarkers();

  return (
    <div className="min-w-[10vw] flex flex-col">
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
      <Checkbox
        label={
          <Typography className="text-white">
            {t("enable_high-quality_video")}
          </Typography>
        }
        ripple={false}
        checked={isHighQuality}
        onChange={(e) => setIsHighQuality(e.target.checked)}
      />
    </div>
  );
});

MarkerControl.propTypes = {
  activeSidePanel: PropTypes.string,
  setActiveSidePanel: PropTypes.func,
  isDraggable: PropTypes.bool,
  setIsDraggable: PropTypes.func,
  widgets: PropTypes.object,
  setWidgets: PropTypes.func,
  t: PropTypes.func,
};

export default MarkerControl;
