import { Radio, Typography } from "@material-tailwind/react";
import baseLayers, { layerSave } from "../../../../../configurations/mapLayers";
import { useEffect, useState } from "react";

import { useTheme } from "../../../../../customHooks/useTheme";

const TileLayerControl = ({ t }) => {
  const { theme, setCurrentLayer } = useTheme();

  //layers

  const [selectedLayer, setSelectedLayer] = useState(
    localStorage.getItem("selectedLayer") || baseLayers[0].name
  );
  const filteredLayers =
    theme === "dark"
      ? baseLayers.filter((layer) => layer.name.includes("Dark"))
      : baseLayers.filter((layer) => !layer.name.includes("Dark"));

  const handleLayerChange = (layerName) => {
    setSelectedLayer(layerName);
    layerSave(layerName);
    setCurrentLayer(layerName);
  };

  useEffect(() => {
    if (theme === "dark") {
      !selectedLayer.includes("Dark") && handleLayerChange("Dark");
    } else {
      !selectedLayer.includes("Transport") && handleLayerChange("Transport");
    }
  }, [theme]);
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
            <Typography className="mr-3 text-white">{layer.name}</Typography>
          }
        />
      ))}
    </div>
  );
};

export default TileLayerControl;
