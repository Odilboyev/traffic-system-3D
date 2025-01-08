import { t } from "i18next";
import { toast } from "react-toastify";

const generateToastContent = (sensorData) => (
  <div className="w-full pointer-events-none">
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
    <div className="mb-2">
      <p className="inline-block mr-4">{t("sensor_value")}:</p>
      <strong>{sensorData.sensor_value}</strong>
    </div>
    <div className="mb-2">
      <p className="inline-block mr-4">{t("eventdate")}:</p>
      <strong>{sensorData.eventdate.split(" ")[1]}</strong>
    </div>
  </div>
);

const toaster = (sensorData, map) => {
  if (toastConfig.enabled === false) return null;
  
  const toastId = `${sensorData?.sensor_name}-${sensorData?.eventdate}`;
  console.log(toastId, "toaster working");
  if (toast.isActive(toastId)) {
    return null;
  }
  const toastContent = generateToastContent(sensorData);
  const handleClick = () => {
    if (sensorData.lat && sensorData.lng) {
      map.flyTo([+sensorData.lat, +sensorData.lng], 18);
    }
  };

  const toastOptions = {
    ...toastConfig,
    onClick: handleClick,
    icon: false,
    toastId: toastId,
  };

  switch (sensorData.statuserror) {
    case 0:
      toast.success(toastContent, toastOptions);
      break;
    case 1:
      toast.warn(toastContent, toastOptions);
      break;
    case 2:
      toast.error(toastContent, toastOptions);
      break;
    default:
      toast.info(toastContent, toastOptions);
  }
  return null;
};

const toastConfig = {
  containerId: "alarms",
  position: "top-right",
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
  className: "pointer-events-auto",
  enabled: false,
};
export const modalToastConfig = {
  position: "bottom-right",
  autoClose: 3000,
  containerId: "modal",
};
export { toastConfig };
export default toaster;
