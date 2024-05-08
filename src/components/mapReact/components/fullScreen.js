import L from "leaflet";
import { useEffect } from "react";
const Legend = ({ map, content }) => {
  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "description");
      L.DomEvent.disableClickPropagation(div);

      const text = content;

      div.innerHTML = text;

      return div;
    };

    legend.addTo(map);
  }, [map]);

  return null;
};
export default Legend;
