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

const DraggableMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Update position on click
    },
  });
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 20, {
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
  selectedCrossroad,
  lat = 41.2995,
  lng = 69.2401,
  handleInputChange,
}) => {
  console.log(selectedCrossroad, "selectedCrossroad - LocationPicker");
  const { currentLayer } = useTheme();
  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);
  return (
    <div className="w-full h-64 rounded-md ">
      <MapContainer
        center={[lat, lng]}
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
  );
};

export default LocationPicker;
