import CrossroadDashboard from "../../../components/crossroad/subPages/crossroadDash";
import Modal from "../../../../../components/modal";
import SensorPartWrapper from "../../../components/deviceModal/components/sensorSection/wrapper";
import TrafficLightDashboard from "../../../components/trafficLightsModal/components/trafficLightDashboard";
import Videos from "../../../components/crossroad/subPages/videos";
const CrossroadDataModal = ({
  t,
  open,
  data,
  device,
  marker,
  handler,
  section,
}) => {
  return (
    <Modal
      size={"lg"}
      height={"h-auto"}
      open={open}
      handleOpen={handler}
      title={t(section)}
      body={
        <>
          {section === "videos" && <Videos t={t} videos={data} />}
          {section === "sensors" && <SensorPartWrapper t={t} device={device} />}
          {section === "trafficlights" && (
            <div className="h-[80vh] relative">
              <TrafficLightDashboard t={t} id={marker?.cid} isInModal />{" "}
            </div>
          )}
          {section === "statistics" && (
            <CrossroadDashboard t={t} marker={marker} />
          )}
        </>
      }
    />
  );
};

export default CrossroadDataModal;
