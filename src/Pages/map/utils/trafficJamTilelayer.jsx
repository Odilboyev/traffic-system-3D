import { memo, useCallback, useEffect, useMemo, useState } from "react";

import PropTypes from "prop-types";
import { TileLayer } from "react-leaflet";
const TrafficJamLayer = memo(
  ({ showTrafficJam }) => {
    const [trafficTimestamp, setTrafficTimestamp] = useState(
      Math.floor(Date.now() / 60000) * 60
    );

    const updateTrafficTimestamp = useCallback(() => {
      const newTimestamp = Math.floor(Date.now() / 60000) * 60;
      setTrafficTimestamp(newTimestamp);
    }, []);

    useEffect(() => {
      let intervalId;
      if (showTrafficJam) {
        intervalId = setInterval(updateTrafficTimestamp, 60000);

        return () => {
          if (intervalId) clearInterval(intervalId);
        };
      }
    }, [showTrafficJam, updateTrafficTimestamp]);

    const trafficJamLayerUrl = useMemo(
      () =>
        `https://core-jams-rdr-cache.maps.yandex.net/1.1/tiles?l=trf&lang=ru_RU&x={x}&y={y}&z={z}&scale=1&tm=${trafficTimestamp}`,
      [trafficTimestamp]
    );

    if (!showTrafficJam) return null;

    return (
      <TileLayer
        key={`traffic-jam-layer-${trafficTimestamp}`}
        url={trafficJamLayerUrl}
        tileSize={256}
        zoomOffset={0}
        maxNativeZoom={20}
        maxZoom={20}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.showTrafficJam === nextProps.showTrafficJam;
  }
);

TrafficJamLayer.propTypes = {
  showTrafficJam: PropTypes.bool,
};

export default TrafficJamLayer;
