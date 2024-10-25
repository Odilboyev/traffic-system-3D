import { toast } from "react-toastify";
import { fetchDataForManagement } from "../../../../../../../api/api.handlers";

// Get initial data based on type
export const getInitialData = (type) => {
  switch (type) {
    case "user":
      return { name: "", email: "", password: "", role: "operator" };
    case "crossroad":
      return { name: "", lat: 41.2995, lng: 69.2401 };
    case "cameratraffic":
      return {
        name: "",
        crossroad_id: "",
        ip: "",
        login: "",
        password: "",
        rtsp_port: 554,
        http_port: 80,
        https_port: 443,
        sdk_port: 8000,
        lat: 41.2995,
        lng: 69.2401,
      };
    case "boxmonitor":
      return {
        name: "",
        sn: "bg-",
        crossroad_id: "",
        ip: "10.10.10.10",
        lat: "",
        lng: "",
      };
    case "svetofor":
      return {
        name: "",
        crossroad_id: "",
        ip: "",
        login: "",
        password: "",
        http_port: "",
        ws_port: "",
        sdk_port: "",
        debug_port: "",
        lat: "",
        lng: "",
      };
    default:
      return {};
  }
};
// Fetch crossroads
export const crossroadHandler = async (
  formData,
  setCrossroads,
  setSelectedCrossroad,
  handleInputChange
) => {
  try {
    const data = await fetchDataForManagement("GET", "crossroad", {
      params: { limit: 0 }, // Optional: Fetch only active crossroads
    });
    console.log("Crossroads Data:", data.data);
    setCrossroads(data.data);
    if (formData.crossroad_id) {
      setSelectedCrossroad(
        data.data.find((item) => item.id == formData.crossroad_id)
      );
    } else {
      setSelectedCrossroad(data.data[0]);
      handleInputChange("crossroad_id", data.data[0].id);
    }
  } catch (error) {
    console.error("Error fetching crossroads:", error);
    toast.error("Failed to fetch crossroads.");
    throw new Error(error);
  }
};

export const fetchSingleBox = async (
  id,
  setSensors,
  setSelectedSensors,
  handleInputChange
) => {
  try {
    const data = await fetchDataForManagement("GET", "boxmonitor", { id });
    console.log("sinfle box Data:", data.data);
    setSensors(data.data.sensors);
    setSelectedSensors(
      data.data.sensors.filter((sensor) => sensor.status === 1)
    );
    handleInputChange("sensors", data.data.sensors);
    // if (formData.crossroad_id) {
    //   setSelectedCrossroad(
    //     data.data.find((item) => item.id == formData.crossroad_id)
    //   );
    // } else {
    //   setSelectedCrossroad(data.data[0]);
    //   handleInputChange("crossroad_id", data.data[0].id);
    // }
  } catch (error) {
    console.error("Error fetching crossroads:", error);
    toast.error("Failed to fetch crossroads.");
    throw new Error(error);
  }
};
