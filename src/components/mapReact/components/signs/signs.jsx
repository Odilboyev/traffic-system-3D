import { Marker, Popup } from "react-leaflet";
import { useState } from "react";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import CustomMarker from "./customMarker";
import "./Signs.css";
import { getNearbySigns } from "../../../../api/api.handlers";

const Signs = ({
  signs, // signs state
  setSigns, // setter for signs
  clearSigns, // function to clear signs data
}) => {
  const [selectedSign, setSelectedSign] = useState(null);
  const [location, setLocation] = useState(null);
  const handleSignClick = (sign, location) => {
    console.log("handleSignClick", sign, location);
    setSelectedSign(sign); // Set the selected sign to show more details
    setLocation(location);
  };

  const closePopup = () => {
    setSelectedSign(null);
    setLocation(null);
  };

  useMapDataFetcher({
    fetchData: async (body) => {
      const response = await getNearbySigns(body);
      if (response.status === "error") {
        console.error(response.message);
        clearSigns();
        return;
      }
      setSigns(response.data);
    },
    onClearData: clearSigns,
    minZoom: 18,
    fetchDistanceThreshold: 100,
  });

  return (
    <>
      {signs.map((v, i) => (
        <CustomMarker
          key={i}
          position={[v.lat, v.lng]}
          v={v}
          location={[v.lat, v.lng]}
          handleSignClick={() => handleSignClick({ ...v }, [v.lat, v.lng])}
        >
          {selectedSign && location && (
            <Popup onClose={closePopup} className="z-30">
              <div style={{ padding: "10px", fontSize: "14px" }}>
                <strong>roadsign_code:</strong> {selectedSign.roadsign_code}{" "}
                <br />
                <strong>roadsign_description:</strong>{" "}
                {selectedSign.roadsign_description} <br />
                <strong>roadsign_installation_date:</strong>{" "}
                {selectedSign.roadsign_installation_date} <br />
                <strong>removal_date:</strong>{" "}
                {selectedSign.removal_date || "--"} <br />
                <strong>status:</strong>{" "}
                {selectedSign.status === "active"
                  ? "Установлен"
                  : "Не установлен"}
              </div>
            </Popup>
          )}
        </CustomMarker>
      ))}

      {/* Custom Leaflet Popup */}
    </>
  );
};

export default Signs;
