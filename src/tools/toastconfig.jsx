import { t } from "i18next";
import { toast } from "react-toastify";

const generateToastContent = (sensorData) => (
  <div className="w-full">
    <div className="mb-2">
      <p className="inline-block mr-4">{t("crossroad")}:</p>
      <strong>{sensorData.crossroad_name}</strong>
    </div>
    <div className="mb-2">
      <p className="inline-block mr-4">{t("type_name")}:</p>
      <strong>{sensorData.type_name}</strong>
    </div>
    <div className="mb-2">
      <p className="inline-block mr-4">{t("device_name")}:</p>
      <strong>{sensorData.device_name}</strong>
    </div>
    <div className="mb-2">
      <p className="inline-block mr-4">{t("sensor_name")}:</p>
      <strong>{sensorData.sensor_name}</strong>
    </div>
    <div className="mb-2">
      <p className="inline-block mr-4">{t("status_name")}:</p>
      <strong>{sensorData.status_name}</strong>
    </div>
  </div>
);

const toaster = (sensorData, toastConfig) => {
  const toastContent = generateToastContent(sensorData);

  switch (sensorData.statuserror) {
    case 0:
      toast.success(toastContent, toastConfig);
      break;
    case 1:
      toast.warn(toastContent, toastConfig);
      break;
    case 2:
      toast.error(toastContent, toastConfig);
      break;
    default:
      toast.info(toastContent, toastConfig);
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
