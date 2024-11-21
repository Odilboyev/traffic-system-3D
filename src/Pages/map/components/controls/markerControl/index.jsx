import { Checkbox, Typography } from "@material-tailwind/react";
import { memo, useCallback } from "react";
import {
  updateIsDraggable,
  updateIsHighQuality,
} from "../../../../../redux/mapSlice";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";

const MarkerControl = memo(({ t }) => {
  // const { isDraggable, setIsDraggable, isHighQuality, setIsHighQuality } =
  //   useMapMarkers();
  const dispatch = useDispatch();
  const isDraggable = useSelector((state) => state.map.isDraggable);
  const isHighQuality = useSelector((state) => state.map.isHighQuality);
  const setIsDraggable = useCallback(
    (isDraggableState) => {
      dispatch(updateIsDraggable(isDraggableState));
    },
    [dispatch]
  );
  const setIsHighQuality = useCallback(
    (isHighQualityState) => {
      dispatch(updateIsHighQuality(isHighQualityState));
    },
    [dispatch]
  );

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
