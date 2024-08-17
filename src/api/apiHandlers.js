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
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getBoxData = async (id) => {
  const res = await config.get(import.meta.env.VITE_DEVICE_DATA + id);

  if (res && res.data.status == 999) {
    console.log("logged out", res);
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
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getTrafficLightsData = async (id) => {
  const res = await config.get(import.meta.env.VITE_TRAFFICLIGHTS_DATA + id);
  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
const getCrossRoadChart = async (body) => {
  const res = await config.post(import.meta.env.VITE_CROSSROAD_CHART, body);

  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

const markerHandler = async (body) => {
  const res = await config.post(import.meta.env.VITE_MARKER, body);

  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

const GetCurrentAlarms = async () => {
  const res = await config.get(import.meta.env.VITE_CURRENT_ALARMS);

  if (res && res.data.status == 999) {
    console.log("logged out", res);
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
    console.log("logged out", res);
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
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

// WEATHER CARD
const getWeatherData = async () => {
  const res = await config.get(import.meta.env.VITE_WEATHER_INFO);
  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
// LANGUAGES
const getTexts = async () => {
  const res = await config.get(import.meta.env.VITE_LANGUAGE);
  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};

// SVETOFORLAR
const getNearByTrafficLights = async (body) => {
  const res = await config.post(import.meta.env.VITE_NEARBYLIGHTS, body);
  if (res && res.data.status == 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
  } else return res.data;
};
// Event history
const endpointMap = {
  all: import.meta.env.VITE_GET_ERROR_HISTORY,
  camera: import.meta.env.VITE_CAMERA_CASE_HISTORY,
  trafficlight: import.meta.env.VITE_TRAFFIC_LIGHT_HISTORY,
  boxcontroller: import.meta.env.VITE_BOX_CONTROLLER_HISTORY,
  crossroad: import.meta.env.VITE_CROSSROAD_HISTORY,
  // Add more mappings as needed
};

const getCaseHistory = async (type, current) => {
  console.log(type);
  const res = await config.get(endpointMap[type] + `/${current}`);
  if (res && res.data.status == 999) {
    console.log("logged out", res);
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
  getWeatherData,
  getTexts,
  getNearByTrafficLights,
  getCaseHistory,
};
