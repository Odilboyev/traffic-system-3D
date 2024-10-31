import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useTheme } from "../../../../../../../customHooks/useTheme";
import baseLayers from "../../../../../../../configurations/mapLayers";
import { MdLocationOn } from "react-icons/md";
import { t } from "i18next";

const DraggableMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, position);

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => setPosition(e.target.getLatLng()),
      }}
    />
  );
};
// Location picker for crossroads
const LocationPicker = ({
  isInline = false,
  lat = 41.2995,
  lng = 69.2401,
  handleInputChange,
}) => {
  const { currentLayer } = useTheme();
  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);
  return (
    <div
      className={`w-full h-full flex flex-col ${isInline ? "flex-row" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <MdLocationOn className="text-gray-600 dark:text-gray-300" size={24} />
        <label>{t("location")}</label>
      </div>
      <div
        className={`flex-grow rounded-md w-full overflow-hidden ${
          isInline ? "w-1/2" : ""
        }`}
      >
        <MapContainer
          center={[lat, lng]}
          attributionControl={false}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          {currentLayerDetails && (
            <TileLayer
              maxNativeZoom={currentLayerDetails.maxNativeZoom}
              url={currentLayerDetails.url}
              attribution={currentLayerDetails.attribution}
              key={currentLayerDetails.name}
              maxZoom={22}
            />
          )}
          <DraggableMarker
            position={[lat, lng]}
            setPosition={(latlng) => {
              handleInputChange("lat", latlng.lat);
              handleInputChange("lng", latlng.lng);
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
