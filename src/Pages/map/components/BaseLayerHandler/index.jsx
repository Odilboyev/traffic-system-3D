import { useEffect } from "react";
import { useMap, TileLayer } from "react-leaflet";
import { useTheme } from "../../../../customHooks/useTheme";
import baseLayers from "../../../../configurations/mapLayers";

const BaseLayerHandler = () => {
  const map = useMap();
  const { show3DLayer } = useTheme();
  const baseLayer = baseLayers[0];

  useEffect(() => {
    const layers = map._layers;
    
    // Remove all tile layers when 3D is enabled
    if (show3DLayer) {
      Object.keys(layers).forEach(key => {
        const layer = layers[key];
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });
    }
  }, [map, show3DLayer]);

  // Only render the TileLayer when 3D is disabled
  return !show3DLayer ? (
    <TileLayer
      url={baseLayer.url}
      attribution={baseLayer.attribution}
      maxNativeZoom={baseLayer.maxNativeZoom}
    />
  ) : null;
};

export default BaseLayerHandler;
