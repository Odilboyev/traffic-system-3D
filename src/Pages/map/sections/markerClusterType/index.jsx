import { Radio, Typography } from "@material-tailwind/react";
import { useMapMarkers } from "../../hooks/useMapMarkers";

const MarkerClusterType = ({ t }) => {
  const {
    getDataHandler,
    setMarkers,
    useClusteredMarkers,
    setUseClusteredMarkers,
  } = useMapMarkers();

  return (
    <div className="flex rounded-b-lg flex-col p-3 bg-gray-900/80 text-blue-gray-900">
      {["clustered", "clustered_dynamically", "dynamic"].map((type) => (
        <Radio
          key={type}
          checked={useClusteredMarkers === type}
          className="checked:bg-white"
          value={type === useClusteredMarkers}
          onChange={() => {
            setUseClusteredMarkers(type);
            type !== "dynamic" ? getDataHandler() : setMarkers([]);
            console.log(type, "type");
          }}
          label={
            <Typography className="mr-3 text-white">{t(type) || ""}</Typography>
          }
        />
      ))}
    </div>
  );
};

export default MarkerClusterType;
