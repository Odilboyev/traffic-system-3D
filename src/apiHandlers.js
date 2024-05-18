import login from "./Auth";
import config from "./api.config";
import axios from "axios";
const signIn = async (body) => {
  const res = await axios.post(
    import.meta.env.VITE_MAIN_URL + import.meta.env.VITE_SIGN_IN,
    body
  );
  return res.data;
};
const getMarkerData = async () => {
  const res = await config.get(import.meta.env.VITE_MARKER_DATA);
  console.log(res.data);
  return res.data;
};
const getBoxData = async (id) => {
  const res = await config.get(import.meta.env.VITE_DEVICE_DATA + id);

  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

const getBoxSensorChart = async (device_id, sensor_id) => {
  const res = await config.post(import.meta.env.VITE_SENSOR_CHART, {
    device_id,
    sensor_id,
  });
  return res.data;
};
const getCrossRoadData = async (id) => {
  const res = await config.get(import.meta.env.VITE_CROSSROAD_DATA + id);
  return res.data;
};

const getCrossRoadChart = async (body) => {
  const res = await config.post(import.meta.env.VITE_CROSSROAD_CHART, body);
  return res.data;
};

const markerHandler = async (body) => {
  const res = await config.post(import.meta.env.VITE_MARKER, body);
  return res.data;
};

const GetCurrentAlarms = async () => {
  const res = await config.get(import.meta.env.VITE_CURRENT_ALARMS);
  return res.data;
};
const getErrorHistory = async (current) => {
  const res = await config.get(
    import.meta.env.VITE_GET_ERROR_HISTORY + `/${current}`
  );
  return res.data;
};
export {
  signIn,
  getMarkerData,
  getCrossRoadData,
  getBoxData,
  getBoxSensorChart,
  getCrossRoadChart,
  markerHandler,
  GetCurrentAlarms,
  getErrorHistory,
};
