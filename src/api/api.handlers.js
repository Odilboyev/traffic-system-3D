import axios from "axios";
import config from "./api.config";
import login from "../Auth";

// Helper function to handle responses
const handleResponse = (res) => {
  if (res && (res.data?.status === 999 || res?.status === 999)) {
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

const getDataWithParams = async (endpoint, params) => {
  const res = await config.get(endpoint, { params });
  return handleResponse(res);
};

const postData = async (endpoint, body) => {
  const res = await config.post(endpoint, body);
  return handleResponse(res);
};
const putData = async (endpoint, data) => {
  const res = await config.put(endpoint, data);
  return handleResponse(res);
};
// Specific API functions using helper functions
const getMarkerData = async () => getData(import.meta.env.VITE_MARKER_DATA);
const getBoxData = async (id) => getData(import.meta.env.VITE_DEVICE_DATA, id);
const getCrossRoadData = async (id) =>
  getData(import.meta.env.VITE_CROSSROAD_DATA, id);
const getCrossRoadInfo = async (id) =>
  getData(import.meta.env.VITE_CROSSROAD_INFO, "/" + id);
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
const getErrorHistory = async (current, body) =>
  postData(import.meta.env.VITE_GET_ERROR_HISTORY + `/${current}`, body);
const getBoxSensorChart = async (device_id, sensor_id) =>
  postData(import.meta.env.VITE_SENSOR_CHART, { device_id, sensor_id });
const getInfoForCards = async () =>
  getData(import.meta.env.VITE_DASHBOARD_FOR_BOXES);
const getWeatherData = async () => getData(import.meta.env.VITE_WEATHER_INFO);
const getTexts = async () => getData(import.meta.env.VITE_LANGUAGE);
const getNearbyTrafficLights = async (body) =>
  postData(import.meta.env.VITE_NEARBYLIGHTS, body);
const getNearbySigns = async (body) =>
  postData(import.meta.env.VITE_NEARBYSIGNS, body);
const getUserRoles = async () => getData(import.meta.env.VITE_USER_ROLES);
const getTrafficLightsConfig = async (id) =>
  getData(import.meta.env.VITE_TRAFFIC_LIGHTS_CONFIG, id);
const getAllMarkers = async (body) =>
  postData(import.meta.env.VITE_ALL_MARKERS, body);
const getDistricts = async (region_id) =>
  getDataWithParams(import.meta.env.VITE_DISTRICTS, { region_id });
const getRegions = async () => getData(import.meta.env.VITE_REGIONS);
const getOverviewCameraModels = async () =>
  getData(import.meta.env.VITE_OVERVIEW_CAMERA + "/camera_view_model");
const getCameraDetails = async (type, id) => await getData(type, "/" + id);
const modifyPTZCamera = async (data) =>
  putData(import.meta.env.VITE_OVERVIEW_CAMERA + "/ptz_control", data);
const modifySvetofor = async (data, id) =>
  postData(import.meta.env.VITE_TRAFFIC_LIGHTS_UPDATE + "/" + id, data);
const getFuelStations = async () => getData(import.meta.env.VITE_FUEL_STATIONS);
const getFuelStationWidgets = async () =>
  getData(import.meta.env.VITE_FUEL_STATION_WIDGETS);
const getTrafficStatsData = async (id, params) =>
  getDataWithParams(import.meta.env.VITE_TRAFFIC_STATS + "/" + id, params);
const getTrafficJamLines = async () =>
  getData(import.meta.env.VITE_TRAFFICJAM_LINES);
const getFineStats = async () => getData(import.meta.env.VITE_FINE_STATS);
const getFineMarkers = async () => getData(import.meta.env.VITE_FINE_MARKERS);
const getFineLastData = async () =>
  getData(import.meta.env.VITE_FINE_LAST_DATA);
const getParkingLots = async () => getData(import.meta.env.VITE_PARKING_LOTS);
const getParkingWidgets = async () =>
  getData(import.meta.env.VITE_PARKING_WIDGETS);
const getBusLines = async () =>
  getData(import.meta.env.VITE_PUBLIC_TRANSPORT_BUS_LINES);
const getBusWidgets = async () =>
  getData(import.meta.env.VITE_PUBLIC_TRANSPORT_BUS_WIDGETS);
const getBusRealtimeLocations = async (body) =>
  postData(import.meta.env.VITE_PUBLIC_TRANSPORT_BUS_REALTIME_LOCATIONS, body);
// 2GIS viewport-based bus location API
const getBusLocationsInViewport = async (viewport) => {
  const res = await axios.post(
    `https://eta.api.2gis.ru/v2/points/viewport`,
    {
      immersive: false,
      type: "online5",
      viewport: viewport,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: "https://2gis.uz",
        Referer: "https://2gis.uz/",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
    }
  );
  return handleResponse(res);
};

// **New Dynamic API Caller**
const fetchDataForManagement = async (method, type, options = {}) => {
  let endpoint;
  // Handle dynamic user endpoint customization
  // if (type?.startsWith("user")) {
  //   const suffix = type.substring("user".length); // Extract suffix (e.g., '/active')
  //   endpoint = `${import.meta.env.VITE_USERS}${suffix}`;
  // } else {
  endpoint = type;
  // }

  const url = `${endpoint}/${options.id ? `${options.id}` : ""}`;

  // Merge isactive into params if provided
  const params = { ...options.params };
  if (typeof options.isactive !== "undefined") {
    params.isactive = options.isactive; // Add isactive to params if provided
  }

  try {
    const res = await config({
      method: method.toUpperCase(),
      url,
      data:
        method.toUpperCase() !== "PATCH" && method.toUpperCase() !== "DELETE"
          ? options.data
          : {},
      params, // Pass merged params including isactive (if any)
    });
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to ${method.toUpperCase()} ${type}:`, error);
    throw error;
  }
};

// Devices API functions
const endpointMap = {
  camera: import.meta.env.VITE_CAMERAS,
  svetofor: import.meta.env.VITE_TRAFFIC_LIGHTS,
  boxcontroller: import.meta.env.VITE_BOX_CONTROLLERS,
  crossroad: import.meta.env.VITE_CROSSROADS,
  cameratraffic: import.meta.env.VITE_CAMERATRAFFIC,
  users: import.meta.env.VITE_USERS,
};

// Fetch device or user data
const getDevices = async (type) => {
  let endpoint;

  // Check if the type contains 'user' and customize the endpoint if necessary
  if (type.startsWith("user")) {
    // Extract the suffix after 'user' (e.g., '/active') and append it to the VITE_USERS endpoint
    const suffix = type.substring("user".length); // This will include the '/' if present
    endpoint = `${import.meta.env.VITE_USERS}${suffix}`;
  } else {
    // Default to the mapped endpoint
    endpoint = endpointMap[type];
  }

  return getData(endpoint);
};

// User-specific functions
const getInfoAboutCurrentUser = () => getData(import.meta.env.VITE_USER_INFO);

const listUsers = async (filter, current = 1) => {
  return getDevices(filter, current);
};

const addUser = async (user) => {
  const res = await postData(import.meta.env.VITE_USER_ADD, user);
  return handleResponse(res);
};

const updateUser = async (user) => {
  const res = await postData(import.meta.env.VITE_USER_UPDATE, user);
  return handleResponse(res);
};

const deleteUser = async (user_id) => {
  const res = await postData(import.meta.env.VITE_USER_DELETE, {
    user_id,
  });
  return handleResponse(res);
};

const recoverUser = async (user_id) => {
  const res = await postData(import.meta.env.VITE_USER_RECOVERY, {
    user_id,
  });
  return handleResponse(res);
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
  addUser,
  deleteUser,
  fetchDataForManagement,
  getAllMarkers,
  getBoxData,
  getBoxSensorChart,
  getCrossRoadChart,
  getCrossRoadData,
  getCrossRoadInfo,
  getCrossRoadStats,
  getCurrentAlarms,
  getDevices,
  getFuelStations,
  getFuelStationWidgets,
  getDistricts,
  getErrorHistory,
  getInfoAboutCurrentUser,
  getInfoForCards,
  getMarkerData,
  getNearbySigns,
  getNearbyTrafficLights,
  getRegions,
  getOverviewCameraModels,
  getTexts,
  getTrafficLightsConfig,
  getTrafficLightsData,
  getUserRoles,
  getWeatherData,
  getTrafficStatsData,
  getTrafficJamLines,
  getFineStats,
  getFineMarkers,
  getFineLastData,
  getParkingLots,
  getParkingWidgets,
  getBusLines,
  getBusWidgets,
  getBusLocationsInViewport,
  getBusRealtimeLocations,
  listUsers,
  markerHandler,
  recoverUser,
  signIn,
  subscribeToCurrentAlarms,
  updateUser,
  getCameraDetails,
  modifyPTZCamera,
  modifySvetofor,
};
