const baseLayers = [
  {
    name: "OpenStreetMap",
    checked: false,
    maxNativeZoom: 19,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "OpenStreetMap",
  },
  {
    name: "Cesium",
    checked: false,
    maxNativeZoom: 19,
    url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Cesium Dark",
    checked: false,
    maxNativeZoom: 19,
    url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Light",
    checked: false,
    maxNativeZoom: 19,
    url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  },
  {
    name: "Transport",
    checked: false,
    maxNativeZoom: 22,
    url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
    attribution: "Transport",
  },
  {
    name: "Transport Dark",
    checked: false,
    maxNativeZoom: 22,
    url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
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
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  },
  {
    name: "Yandex",
    checked: false,
    maxNativeZoom: 20,
    url: "https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU",
    attribution: "Yandex",
  },
  {
    name: "Yandex Dark",
    checked: false,
    maxNativeZoom: 20,
    url: "https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&theme=dark&lang=ru_RU",
    attribution: "Yandex",
  },
];

const layerSave = (layer) => {
  if (typeof layer === "string") {
    localStorage.setItem("selectedLayer", layer);
  } else {
    localStorage.setItem("selectedLayer", layer.name);
    localStorage.setItem("trafficJamEnabled", layer.showTraffic.toString());
  }
};

export { layerSave };
export default baseLayers;
