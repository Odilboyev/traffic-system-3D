import L from "leaflet";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";
import { Marker } from "react-leaflet";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import NeonIcon from "../../../../components/neonIcon";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import iconSelector from "./iconSelector";

const TrafficLightMarkers = ({
  trafficLights,
  setTrafficLights,
  setWssLink,
  setCurrentSvetoforId,
  currentSvetoforId,
  clearTrafficLights,
  updateTrafficLights,
}) => {
  // Fetching function passed to custom hook
  const fetchTrafficLights = async (body) => {
    try {
      const response = await getNearbyTrafficLights(body);

      if (response.status === "error") {
        console.error(response.message);
        clearTrafficLights(); // Clear state and close WebSocket on error
        return;
      }

      setTrafficLights(response.data);

      // Only open a new WebSocket if the svetofor_id has changed
      if (currentSvetoforId !== response.svetofor_id) {
        setCurrentSvetoforId(response.svetofor_id);
        setWssLink(response.wss_link);
      }
    } catch (error) {
      console.error("Error fetching traffic lights:", error);
      clearTrafficLights();
    }
  };

  // Use the custom hook
  useMapDataFetcher({
    fetchData: fetchTrafficLights,
    onClearData: clearTrafficLights,
    onNewData: updateTrafficLights,
    minZoom: 19,
    fetchDistanceThreshold: 100,
  });

  return (
    <>
      {trafficLights?.map((v, i) => (
        <Marker
          key={i}
          position={[v.lat, v.lng]}
          icon={L.divIcon({
            className: "rounded-full flex items-center justify-center",
            html: renderToString(
              <NeonIcon
                isRounded={false}
                icon={
                  v.type !== 100 &&
                  iconSelector({
                    type: v.type,
                    status: v.status,
                    style: { transform: `rotate(${v.rotate}deg)` },
                  })
                }
                status={v.status === 1 ? 0 : v.status === 2 ? 2 : 1}
                text={v.type === 100 && (v.countdown || "0")}
              />
            ),
          })}
        />
      ))}
    </>
  );
};

TrafficLightMarkers.propTypes = {
  trafficLights: PropTypes.array.isRequired,
  setTrafficLights: PropTypes.func.isRequired,
  setWssLink: PropTypes.func.isRequired,
  setCurrentSvetoforId: PropTypes.func.isRequired,
  setTrafficSocket: PropTypes.func.isRequired,
  currentSvetoforId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wssLink: PropTypes.string,
  setLastSuccessfulLocation: PropTypes.func.isRequired,
  trafficSocket: PropTypes.object,
  clearTrafficLights: PropTypes.func.isRequired,
  updateTrafficLights: PropTypes.func.isRequired,
};

export default TrafficLightMarkers;
