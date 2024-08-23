import login from "../Auth";
import config from "./api.config";
import axios from "axios";

// Helper function to handle responses
const handleResponse = (res) => {
  if (res && res.data.status === 999) {
    console.log("logged out", res);
    localStorage.clear();
    login.logout();
    window.location.reload();
    return null;
  }
  return res.data;
};

// Auth functions
const signIn = async (body) => {
  const res = await axios.post(
    `${import.meta.env.VITE_MAIN_URL}${import.meta.env.VITE_SIGN_IN}`,
    body
  );
  return handleResponse(res);
};

// Data fetching functions
const getData = async (endpoint, id = "") => {
  const res = await config.get(`${endpoint}${id}`);
  return handleResponse(res);
};

const postData = async (endpoint, body) => {
  const res = await config.post(endpoint, body);
  return handleResponse(res);
};

// Specific API functions using helper functions
const getMarkerData = async () => getData(import.meta.env.VITE_MARKER_DATA);
const getBoxData = async (id) => getData(import.meta.env.VITE_DEVICE_DATA, id);
const getCrossRoadData = async (id) =>
  getData(import.meta.env.VITE_CROSSROAD_DATA, id);
const getTrafficLightsData = async (id) =>
  getData(import.meta.env.VITE_TRAFFICLIGHTS_DATA, id);
const getCrossRoadChart = async (body) =>
  postData(import.meta.env.VITE_CROSSROAD_CHART, body);
const getCrossRoadStats = async (body) =>
  postData(import.meta.env.VITE_CROSSROAD_STATS, body);
const markerHandler = async (body) =>
  postData(import.meta.env.VITE_MARKER, body);
const getCurrentAlarms = async () =>
  getData(import.meta.env.VITE_CURRENT_ALARMS);
const getErrorHistory = async (current) =>
  getData(import.meta.env.VITE_GET_ERROR_HISTORY, `/${current}`);
const getBoxSensorChart = async (device_id, sensor_id) =>
  postData(import.meta.env.VITE_SENSOR_CHART, { device_id, sensor_id });
const getInfoForCards = async () =>
  getData(import.meta.env.VITE_DASHBOARD_FOR_BOXES);
const getWeatherData = async () => getData(import.meta.env.VITE_WEATHER_INFO);
const getTexts = async () => getData(import.meta.env.VITE_LANGUAGE);
const getNearByTrafficLights = async (body) =>
  postData(import.meta.env.VITE_NEARBYLIGHTS, body);

// Devices API functions
const endpointMap = {
  camera: import.meta.env.VITE_CAMERAS,
  svetofor: import.meta.env.VITE_TRAFFIC_LIGHTS,
  boxcontroller: import.meta.env.VITE_BOX_CONTROLLERS,
  crossroad: import.meta.env.VITE_CROSSROADS,
  // Add more mappings as needed
};

const getDevices = async (type, current) => {
  const endpoint = endpointMap[type];
  return getData(endpoint, `/${current}`);
};

// WebSocket function
const subscribeToCurrentAlarms = (onDataReceived) => {
  const alarmSocket = new WebSocket(import.meta.env.VITE_ALARM_WS);
  alarmSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onDataReceived(data);
  };
};

// Export functions
export {
  subscribeToCurrentAlarms,
  signIn,
  getMarkerData,
  getBoxData,
  getCrossRoadData,
  getTrafficLightsData,
  getBoxSensorChart,
  getCrossRoadChart,
  getCrossRoadStats,
  markerHandler,
  getCurrentAlarms,
  getErrorHistory,
  getInfoForCards,
  getWeatherData,
  getTexts,
  getNearByTrafficLights,
  getDevices,
};
