import { Radio, Typography } from "@material-tailwind/react";
import baseLayers, { layerSave } from "../../../../../configurations/mapLayers";
import { useEffect, useMemo, useState } from "react";

import { useTheme } from "../../../../../customHooks/useTheme";

const TileLayerControl = ({ t }) => {
  const {
    theme,
    setCurrentLayer,
    showTrafficJam: isTrafficJamEnabled,
    setShowTrafficJam,
  } = useTheme();

  const filteredLayers = useMemo(() => {
    // Combine all layers, prioritizing theme-matched layers
    const themeMatchedLayers = baseLayers.filter((layer) =>
      theme === "dark"
        ? layer.name.includes("Dark")
        : !layer.name.includes("Dark")
    );

    return themeMatchedLayers;
  }, [theme]);

  const [selectedLayer, setSelectedLayer] = useState(() => {
    const savedLayer = localStorage.getItem("selectedLayer");
    const defaultLayer = filteredLayers[0]?.name || baseLayers[0].name;

    // Validate saved layer exists in current filtered layers
    return savedLayer &&
      filteredLayers.some((layer) => layer.name === savedLayer)
      ? savedLayer
      : defaultLayer;
  });

  const handleLayerChange = (layerName) => {
    if (!layerName) return;

    // Disable traffic jam if not on Yandex
    if (!layerName.includes("Yandex") && isTrafficJamEnabled) {
      setShowTrafficJam(false);
    }

    // If switching to Yandex and traffic jam was previously enabled, keep it enabled
    if (layerName.includes("Yandex") && isTrafficJamEnabled) {
      // Ensure Yandex layer matches current theme
      const yandexThemeLayer = theme === "dark" ? "Yandex Dark" : "Yandex";
      layerName = yandexThemeLayer;
    }

    setSelectedLayer(layerName);
    layerSave(layerName);
    setCurrentLayer(layerName);
  };

  useEffect(() => {
    // If traffic jam is enabled and current layer is not Yandex, switch to Yandex
    if (isTrafficJamEnabled && !selectedLayer.includes("Yandex")) {
      const yandexThemeLayer = theme === "dark" ? "Yandex Dark" : "Yandex";
      handleLayerChange(yandexThemeLayer);
    }
  }, [isTrafficJamEnabled, theme]);

  return (
    <div className="flex flex-col min-w-[10vw]">
      {filteredLayers.map((layer) => (
        <Radio
          key={layer.name}
          checked={selectedLayer === layer.name}
          className="checked:bg-white"
          color="blue-gray"
          variant={selectedLayer === layer.name ? "filled" : "outlined"}
          onChange={() => handleLayerChange(layer.name)}
          label={
            <Typography className="mr-3 text-white">
              {layer.name}
              {layer.name.includes("Yandex") && (
                <span className="ml-2 text-xs text-gray-400">
                  {isTrafficJamEnabled ? "(Traffic Jam)" : ""}
                </span>
              )}
            </Typography>
          }
        />
      ))}
    </div>
  );
};

export default TileLayerControl;
