import CrossroadModal from "../crossroad";
import DeviceModal from "../deviceModal/deviceModal";
import TrafficLightsModal from "../trafficLightsModal";

const MapModals = ({
  crossroadModal,
  deviceModal,
  trafficLightsModal,
  onClose,
}) => {
  return (
    <>
      <CrossroadModal
        isOpen={crossroadModal.isOpen}
        marker={crossroadModal.marker}
        onClose={onClose.crossroad}
      />
      <DeviceModal
        isOpen={deviceModal.isOpen}
        device={deviceModal.device}
        onClose={onClose.device}
      />
      <TrafficLightsModal
        isOpen={trafficLightsModal.isOpen}
        light={trafficLightsModal.light}
        onClose={onClose.trafficLights}
      />
    </>
  );
};

export default MapModals;
