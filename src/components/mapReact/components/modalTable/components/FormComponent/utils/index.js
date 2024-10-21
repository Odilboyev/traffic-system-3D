// Get initial data based on type
const getInitialData = (type) => {
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
    default:
      return {};
  }
};
export { getInitialData };
