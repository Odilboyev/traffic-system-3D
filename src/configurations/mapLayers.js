const baseLayers = [
  {
    name: "OpenStreetMap",
    checked: true,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "OpenStreetMap",
  },
  {
    name: "Transport",
    checked: false,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
    attribution: "Transport",
  },
  {
    name: "Transport Dark",
    checked: false,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
    attribution: "Transport Dark",
  },
  {
    name: "2GIS",
    checked: false,
    url: "http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}",
  },
  {
    name: "Dark",
    checked: false,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  },
];

const layerSave = (e) => {
  const selectedLayer = e.target.options.name;
  localStorage.setItem("selectedLayer", selectedLayer);
};
export { layerSave };
export default baseLayers;