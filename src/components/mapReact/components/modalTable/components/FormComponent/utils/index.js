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
        lat: "",
        lng: "",
      };
    case "cameraview":
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
        lat: "",
        lng: "",
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
        http_port: "80",
        ws_port: "80",
        sdk_port: "8000",
        debug_port: "8081",
        udp_port: "4050",
        vendor_id: "1",
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

    setCrossroads(data.data);
    if (formData.crossroad_id) {
      setSelectedCrossroad(
        formData.crossroad_id
          ? data.data.find((item) => item.id == formData.crossroad_id)
          : data.data[0]
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
