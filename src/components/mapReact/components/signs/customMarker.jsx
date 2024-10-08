import { Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import SignIcon from "./icon";

const CustomMarker = ({ position, v, handleSignClick, children }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current) return; // Ensure the marker reference is available

    // Render the SignIcon component to a string
    const iconHtml = renderToString(<SignIcon v={v} />);

    // Create the custom Leaflet icon with the rendered HTML
    const customIcon = L.divIcon({
      className:
        "custom-marker-content flex flex-col items-center justify-center p-0 rounded-lg bg-white shadow-md !w-auto !h-auto max-w-20 max-h-20 ",
      html: iconHtml,
      iconAnchor: [10, 20],
    });

    // Set the custom icon to the Leaflet marker
    markerRef.current.setIcon(customIcon);

    // Function to attach click events to rendered content
    const attachClickEvents = () => {
      const iconElement = markerRef.current?.getElement();
      if (iconElement) {
        iconElement
          .querySelectorAll(".custom-marker-content .sign")
          .forEach((element, idx) => {
            element.addEventListener("click", () => {
              console.log(idx, v.sings_data[idx]);
              if (v.sings_data && v.sings_data[idx]) {
                handleSignClick({ ...v.sings_data[idx], index: idx }, position);
              }
            });
          });
      }
    };

    // Attach click events after ensuring the DOM is ready
    setTimeout(attachClickEvents, 0);

    // Cleanup to avoid memory leaks
    return () => {
      const iconElement = markerRef.current?.getElement();
      if (iconElement) {
        iconElement
          .querySelectorAll(".custom-marker-content div")
          .forEach((element) => {
            element.removeEventListener("click", handleSignClick);
          });
      }
    };
  }, [v, handleSignClick]);

  return <Marker ref={markerRef} position={position} />;
};

export default CustomMarker;
