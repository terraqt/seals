import "ol/ol.css";
import MVT from "ol/format/MVT";
import Map from "ol/Map";
import Tile from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import XYZ from "ol/source/XYZ";
import { Fill, Stroke, Style } from "ol/style";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import ColorScale from "color-scales";

// 单值染色
const vtLayer = new VectorTileLayer({
  source: new VectorTileSource({
    maxZoom: 13,
    format: new MVT(),
    url:
      "https://dev-tile.terraqt.com/tile/xyz/{z}/{x}/{y}.pbf?path=01a1e4a4-2ab2-41d3-bc25-b9a0a4e8d6cd/cor1010210/202106/CN-140123100/vectortiles",
  }),
  style: new Style({
    stroke: new Stroke({
      color: "gray",
      width: 1,
    }),
    fill: new Fill({
      color: "red",
    }),
  }),
});

// 差值染色
const vtLayer2 = new VectorTileLayer({
  source: new VectorTileSource({
    maxZoom: 13,
    format: new MVT(),
    url:
      "https://dev-tile.terraqt.com/tile/xyz/{z}/{x}/{y}.pbf?path=01a1e4a4-2ab2-41d3-bc25-b9a0a4e8d6cd/der101.c/202106/CN-140123100/vectortiles",
  }),
  style: (e) => {
    const value = e.properties_.mean_value;
    const colorScale = new ColorScale(0, 1, ["#d64556", "#4aec37"]);
    const color = colorScale.getColor(value);

    return new Style({
      stroke: new Stroke({
        color: "gray",
        width: 1,
      }),
      fill: new Fill({
        color: [color.r, color.g, color.b],
      }),
    });
  },
});

const BaseLayer = new Tile({
  source: new XYZ({
    crossOrigin: "anonymous",
    url:
      "http://t0.tianditu.gov.cn/img_w/wmts?tk=你的token&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",
  }),
});

new Map({
  layers: [BaseLayer, vtLayer],
  target: "map",
  view: new View({
    zoom: 12,
    center: fromLonLat([111.8207, 38.066]),
  }),
});
