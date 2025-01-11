import DeviceModal from "../deviceModal/deviceModal";
import TrafficLightsModal from "../trafficLightsModal";

const MapModals = ({
  crossroadModal,
  isBoxLoading,
  deviceModal,
  isLightsLoading,
  trafficLightsModal,
  onClose,
  t,
}) => {
  return (
    <>
      {/* <CrossroadModal
        isOpen={crossroadModal.isOpen}
        marker={crossroadModal.marker}
        onClose={onClose.crossroad}
      /> */}
      <DeviceModal
        isOpen={deviceModal.isOpen}
        device={deviceModal.device}
        isLoading={isBoxLoading}
        onClose={onClose.device}
      />
      {/* <TrafficLightsModal
        t={t}
        isOpen={trafficLightsModal.isOpen}
        light={trafficLightsModal.light}
        isLoading={isLightsLoading}
        onClose={onClose.trafficLights}
      /> */}
    </>
  );
};

export default MapModals;
