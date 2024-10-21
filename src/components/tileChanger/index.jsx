import React, { useEffect, useState } from "react";
import Control from "../customControl";
import {
  IconButton,
  Radio,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
  Typography,
} from "@material-tailwind/react";
import { MapIcon } from "@heroicons/react/16/solid";
import { useTheme } from "../../customHooks/useTheme";
import baseLayers, { layerSave } from "../../configurations/mapLayers";

const TileChanger = () => {
  const { theme, currentLayer, setCurrentLayer } = useTheme();

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
      handleLayerChange("Dark");
    } else {
      handleLayerChange("Transport");
    }
  }, [theme]);
  return (
    <Control position="topleft">
      <SpeedDial placement="left">
        <IconButton
          // color={theme === "light" ? "black" : "white"}
          size="lg"
        >
          <SpeedDialHandler className="w-10 h-10 cursor-pointer">
            <MapIcon className="w-6 h-6 p-2" />
          </SpeedDialHandler>
        </IconButton>
        <SpeedDialContent className="m-4">
          <div className="flex flex-col p-3 mb-10 rounded-md bg-gray-900/80 text-blue-gray-900 backdrop-blur-md">
            {filteredLayers.map((layer) => (
              <Radio
                key={layer.name}
                checked={selectedLayer === layer.name}
                className="checked:bg-white"
                variant={selectedLayer === layer.name ? "filled" : "outlined"}
                onChange={() => handleLayerChange(layer.name)}
                label={
                  <Typography className="mr-3 text-white">
                    {layer.name}
                  </Typography>
                }
              />
            ))}
          </div>
        </SpeedDialContent>
      </SpeedDial>
    </Control>
  );
};

export default TileChanger;
