import { Marker } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import NeonIcon from "../../../neonIcon";
import { getNearbySigns } from "../../../../api/api.handlers";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";

const Signs = ({
  signs, // signs state
  setSigns, // setter for signs
  clearSigns, // function to clear signs data
}) => {
  // Fetching function passed to custom hook for signs
  const fetchSigns = async (body) => {
    try {
      const response = await getNearbySigns(body); // Adjust this to your signs API call

      if (response.status === "error") {
        console.error(response.message);
        clearSigns(); // Clear state and close WebSocket on error
        return;
      }

      setSigns(response.data);
    } catch (error) {
      console.error("Error fetching signs:", error);
      clearSigns();
    }
  };

  // Use the custom hook for map data fetching
  useMapDataFetcher({
    fetchData: fetchSigns,
    onClearData: clearSigns,
    minZoom: 21,
    fetchDistanceThreshold: 100,
  });

  return (
    <>
      {signs.map((v, i) => (
        <Marker
          key={i}
          position={[v.lat, v.lng]}
          icon={L.divIcon({
            className:
              "flex flex-col items-center justify-center p-0 rounded-lg bg-white shadow-md !w-auto !h-auto", // Adjusted styling
            html: renderToString(
              <>
                <div
                  className="relative bg-white border border-gray-300 rounded-lg overflow-hidden"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "6px",
                    // width: "60px", // Fixed width to match design
                  }}
                >
                  {v.sings_data?.length > 0 ? (
                    <>
                      {v.sings_data.map((sign, idx) => (
                        <img
                          key={idx}
                          className="w-full object-contain"
                          src={`icons/signs/${sign.roadsign_image_url}`}
                          alt={`Sign ${idx}`}
                          style={{
                            borderRadius: "4px",
                            marginBottom: "4px", // Space between images
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <div>No signs available</div>
                  )}
                </div>

                {/* Adding the pointer at the bottom */}
                <div
                  className="drop-shadow-md"
                  style={{
                    position: "absolute",
                    bottom: -10,
                    width: "0",
                    height: "0",
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderTop: "15px solid white",
                    margin: "0 auto", // Center the pointer
                  }}
                ></div>
              </>
            ),
          })}
        />
      ))}
    </>
  );
};

// const iconSelector = ({ type = 1, status = 0, style }) => {
//   const IconComponent = (() => {
//     switch (type) {
//       case 1:
//         return /* Your Icon for type 1 */;
//       case 2:
//         return /* Your Icon for type 2 */;
//       // Add more cases for different sign types
//       default:
//         return /* Your default Icon */;
//     }
//   })();

//   return (

//   );
// };

export default Signs;
