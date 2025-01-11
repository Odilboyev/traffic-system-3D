import { useRef, useState } from 'react';
import MapCore from '../MapCore';
import MapMarkers from '../MapMarkers';
import MapControls from '../MapControls';
import { useTheme } from '../../../../customHooks/useTheme';
import './styles.css';

const Map = () => {
  const [map, setMap] = useState(null);
  const popupsRef = useRef(new Map());
  const { show3DLayer } = useTheme();

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className="map-container">
      <MapCore onMapLoad={handleMapLoad}>
        {map && (
          <>
            <MapMarkers map={map} popupsRef={popupsRef} />
            <MapControls map={map} />
          </>
        )}
      </MapCore>
    </div>
  );
};

export default Map;
