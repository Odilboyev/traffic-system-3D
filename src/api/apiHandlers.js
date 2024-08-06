import login from "../Auth";
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

  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
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
  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getTrafficLightsData = async (id) => {
  const res = await config.get(import.meta.env.VITE_TRAFFICLIGHTS_DATA + id);
  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getCrossRoadChart = async (body) => {
  const res = await config.post(import.meta.env.VITE_CROSSROAD_CHART, body);

  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

const markerHandler = async (body) => {
  const res = await config.post(import.meta.env.VITE_MARKER, body);

  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

const GetCurrentAlarms = async () => {
  const res = await config.get(import.meta.env.VITE_CURRENT_ALARMS);

  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getErrorHistory = async (current) => {
  const res = await config.get(
    import.meta.env.VITE_GET_ERROR_HISTORY + `/${current}`
  );
  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
let alarmSocket;
const subscribeToCurrentAlarms = (onDataReceived) => {
  alarmSocket = new WebSocket(import.meta.env.VITE_ALARM_WS);
  alarmSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onDataReceived(data);
  };
};

// dashboard data for cards
const getInfoForCards = async () => {
  const res = await config.get(import.meta.env.VITE_DASHBOARD_FOR_BOXES);
  if (res && res.data.status == 999) {
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

export {
  subscribeToCurrentAlarms,
  signIn,
  getMarkerData,
  getCrossRoadData,
  getTrafficLightsData,
  getBoxData,
  getBoxSensorChart,
  getCrossRoadChart,
  markerHandler,
  GetCurrentAlarms,
  getErrorHistory,
  getInfoForCards,
};
