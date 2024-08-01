import { toast } from "react-toastify";

const toaster = (sensorData, toastConfig) => {
  console.log(sensorData, "toaster");
  switch (sensorData.statuserror) {
    case 0:
      toast.success(
        `Sensor ${sensorData.sensor_id} updated: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    case 1:
      toast.warn(
        `Sensor ${sensorData.sensor_id} updated with warning: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    case 2:
      toast.error(
        `Sensor ${sensorData.sensor_id} updated with error: ${sensorData.sensor_value}`,
        toastConfig
      );
      break;
    default:
      toast.info(
        `Sensor ${sensorData.sensor_id} updated: ${sensorData.sensor_value}`,
        toastConfig
      );
  }
};

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};
export { toastConfig };
export default toaster;
