import { MapIcon } from "@heroicons/react/16/solid";
import { IconButton, Radio, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Control from "../../../../components/customControl";
import SidePanel from "../../../../components/sidePanel";
import baseLayers, { layerSave } from "../../../../configurations/mapLayers";
import { useTheme } from "../../../../customHooks/useTheme";

const TileChanger = ({ activeSidePanel, setActiveSidePanel }) => {
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
      handleLayerChange("Dark");
    } else {
      handleLayerChange("Transport");
    }
  }, [theme]);
  return (
    <Control position="topleft">
      <div className="relative">
        <IconButton
          size="lg"
          onClick={() =>
            setActiveSidePanel(
              activeSidePanel === "tileChanger" ? null : "tileChanger"
            )
          }
        >
          <MapIcon className="w-6 h-6 " />
        </IconButton>

        <SidePanel
          title="Map Style"
          isOpen={activeSidePanel === "tileChanger"}
          setIsOpen={setActiveSidePanel}
          sndWrapperClass="absolute left-2 min-w-[15vw]"
          content={
            <div className="flex rounded-b-lg flex-col p-3 bg-gray-900/80 text-blue-gray-900">
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
          }
        />
      </div>
    </Control>
  );
};

export default TileChanger;
