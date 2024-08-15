const baseLayers = [
  {
    name: "OpenStreetMap",
    checked: false,
    maxNativeZoom: 19,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "OpenStreetMap",
  },
  {
    name: "Transport",
    checked: false,
    maxNativeZoom: 22,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
    attribution: "Transport",
  },
  {
    name: "Transport Dark",
    checked: false,
    maxNativeZoom: 22,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
    attribution: "Transport Dark",
  },
  {
    name: "2GIS",
    checked: false,
    maxNativeZoom: 18,
    url: "http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}",
  },
  {
    name: "Dark",
    checked: true,
    maxNativeZoom: 22,
    url: "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  },
];

const layerSave = (e) => {
  localStorage.setItem("selectedLayer", e);
};

export { layerSave };
export default baseLayers;
