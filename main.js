import { createRadioSelector, createCheckBox } from './ui.js';
import { LayerType, ToggleType, RasterType } from './enums.js';
import { Field, Message } from "./protobuf.js";
import { Layer, Toggle } from "./classes.js";

import './style.css';
import 'ol/ol.css';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';

const options = {
  runSelector: "1", //hex string
  basemap: LayerType.Road,
  outputFormat: 0,
  rasterType: RasterType.PNG,
  streetViewOverlay: true,
  svLayers: new Message(1, [
    new Message(1, [
      new Field(1, "e", 2),
      new Field(2, "b", 1),
      new Field(3, "e", 2),
    ]),
    new Field(2, "b", 1),
    new Field(4, "b", 1),
  ]),
  showPhotoPaths: 0,
  thinLines: 1,
  _showOfficial: true,
  _showAri: false,
  terrainOverlay: false,
  trafficOverlay: false,
  language: "en",
  regionCode: "us",
  noLabels: false,
  satOverlay: false,
  highDpi: false,
  labelsAndIconsOnly: false,
  noLandUse: false,
  mapStyle: null,
}

// TODO maybe use dict style instead of this
function createUrl(options) {
  const endpoint = "https://www.google.com/maps/vt?pb=";

  const layers = [];
  const toggles = [];

  if (options.basemap !== LayerType.None) {
    layers.push(new Layer(options.basemap, "m"));
  }
  if (options.streetViewOverlay) {
    const svOverlayLayer = new Layer(LayerType.Overlay, "svv", [
      new Message(4, [
        new Field(1, "s", "cc"),
        new Field(2, "s", options.svLayers.toString(true).replaceAll("!", "*21")),
      ]),
      new Message(4, [
        new Field(1, "s", "svl"),
        new Field(2, "s", `*211b${options.showPhotoPaths}*212b${options.thinLines}`),
      ]),
    ]);
    layers.push(svOverlayLayer);
    if (options.basemap !== LayerType.Road) {
      toggles.push(new Toggle(ToggleType.SomeSortOfOverlayThing));
    }
  }
  if (options.terrainOverlay) {
      layers.push(new Layer(LayerType.TerrainAll));
      toggles.push(new Toggle(ToggleType.Terrain));
  }
  
  if (options.trafficOverlay) {
    layers.push(new Layer(LayerType.Overlay, "traffic", [
      new Message(4, [
        new Field(1, "s", "incidents"),
        new Field(2, "s", "1"),
      ]),
      new Message(4, [
        new Field(1, "s", "incidents_text"),
        new Field(2, "s", "1"),
      ]),
    ]));
  }

  if (options.noLabels) {
    toggles.push(new Toggle(ToggleType.NoLabels));
  }
  if (options.satOverlay) {
    toggles.push(new Toggle(ToggleType.SatelliteOverlay));
  }
  if (options.highDpi) {
    toggles.push(new Toggle(ToggleType.HighDpi));
  }
  if (options.labelsAndIconsOnly) {
    toggles.push(new Toggle(ToggleType.LabelsAndIconsOnly));
  }
  if (options.noLandUse) {
    toggles.push(new Toggle(ToggleType.NoLandUse));
  }

  if (options.mapStyle) {
   toggles.push(new Toggle(ToggleType.MapStyle, [
     new Message(2, [
       new Field(1, "s", "styles"),
       new Field(2, "z", options.mapStyle.trim()),
     ])
   ]));
 }

  const message = buildMessage(options, layers, toggles);
  return endpoint + message.toString(true);
}


function buildMessage(options, layers, toggles) {
  return new Message(1, [
    new Message(1, [
      new Message(8, [
        new Message(1, [
          new Field(1, "i", "{z}"),
          new Field(2, "i", "{x}"),
          new Field(3, "i", "{y}"),
        ]),
        new Field(2, "i", 9), // these two are only used for the stream endpoint; ignore this
        new Field(3, "x", options.runSelector),
      ])
    ]),

    ...layers.map(x => x.toMessage()),

    new Message(3, [
      new Field(2, "s", options.language),
      new Field(3, "s", options.regionCode),
      new Field(5, "e", 1105),

      ...toggles.map(x => x.toMessage()),
    ]),

    new Field(4, "e", options.outputFormat),

    new Message(5, [
      new Field(1, "e", options.rasterType),
      new Message(8, [
        new Field(1, "e", 1),
        new Field(1, "e", 1)
      ])
    ]),

    new Message(6, [
      new Field(1, "e", 12),
      new Field(2, "i", 2),
      new Field(11, "e", 0),
      new Field(39, "b", false),
      new Field(44, "e", 0),
      new Field(50, "e", 0),
    ]),
  ]);
}

function refreshUrl() {
  const url = createUrl(options);
  svTileLayer.getSource().setUrl(url);
  document.querySelector("#url").innerText = url;
}

function rebuildSvLayers() {
  const svLayers = new Message(1, [
    new Field(2, "b", 1),
    new Field(4, "b", 1),
  ]);

  if (options.thinLines) {
    if (options._showOfficial) {
      svLayers.fields.push(new Message(1, [
        new Field(1, "e", 2),
        new Field(2, "b", 1),
        new Field(3, "e", 2),
      ]));
    }
    if (options._showAri) {
      svLayers.fields.push(new Message(1, [
        new Field(1, "e", 3),
        new Field(2, "b", 1),
        new Field(3, "e", 2),
      ]));
    }
  } else {
    if (options._showAri) {
      svLayers.fields.push(new Message(1, [
        new Field(1, "e", 3),
        new Field(2, "b", 1),
        new Field(3, "e", 2),
      ]));
    } 
  }
  
  options.svLayers = svLayers;
}


const svTileLayer = new TileLayer({
  source: new XYZ({
    url: "", // set below
  }),
});
refreshUrl();

const map = new Map({
  target: 'map',
  layers: [ svTileLayer ],
  view: new View({
    center: [0, 0],
    zoom: 2,
    constrainResolution: true,
  }),
});


// BEGIN UI CODE

createRadioSelector("raster-type-container", "raster-type",
  [
    { value: RasterType.PNG, description: "PNG", checked: true }, 
    { value: RasterType.JPG, description: "JPG" }, 
    { value: RasterType.GIF, description: "GIF" }, 
    { value: RasterType.WEBP, description: "WEBP" },
    { value: RasterType.DDS, description: "DDS" }, 

  ], 
  (selected) => { 
    options.rasterType = selected;
    refreshUrl();
  },
  false
);

createRadioSelector("base-layer-container", "base-layer",
  [
    { value: LayerType.None, description: "None" }, 
    { value: LayerType.Road, description: "Road", checked: true }, 
    { value: LayerType.Satellite, description: "Satellite" },
  ], 
  (selected) => { 
    options.basemap = selected;
    refreshUrl();
  },
  false
);

createCheckBox("overlays-container", "streetview", "Street View", options.streetViewOverlay,
  (checked) => {
    options.streetViewOverlay = +checked;
    rebuildSvLayers();
    refreshUrl();
  }
);
createCheckBox("overlays-container", "terrain", "Terrain", options.terrainOverlay,
  (checked) => {
    options.terrainOverlay = +checked;
    refreshUrl();
  }
);
createCheckBox("overlays-container", "traffic", "Live traffic", options.trafficOverlay,
  (checked) => {
    options.trafficOverlay = +checked;
    refreshUrl();
  }
);

createCheckBox("toggles-container", "high-dpi", "2x scale (High DPI)", options.highDpi,
  (checked) => {
    options.highDpi = +checked;
    refreshUrl();
  }
);
createCheckBox("toggles-container", "no-labels", "No labels", options.noLabels,
  (checked) => {
    options.noLabels = +checked;
    refreshUrl();
  }
);
createCheckBox("toggles-container", "sat-overlay", "Hybrid overlay", options.satOverlay,
  (checked) => {
    options.satOverlay = +checked;
    refreshUrl();
  }
);
createCheckBox("toggles-container", "labels-and-icons-only", "Labels and icons only", options.labelsAndIconsOnly,
  (checked) => {
    options.labelsAndIconsOnly = +checked;
    refreshUrl();
  }
);
createCheckBox("toggles-container", "no-land-use", "No land use", options.noLandUse,
  (checked) => {
    options.noLandUse = +checked;
    refreshUrl();
  }
);

createCheckBox("streetview-container", "thin-lines", "Thin lines", true, 
  (checked) => {
    options.thinLines = +checked;
    rebuildSvLayers();
    refreshUrl();
  }
);
createCheckBox("streetview-container", "official", 'Show official coverage ("outdoor" only for thick lines)', true, 
  (checked) => {
    options._showOfficial = checked;
    rebuildSvLayers();
    refreshUrl();
  }
);
createCheckBox("streetview-container", "ari", "Show third party coverage", false, 
  (checked) => {
    options._showAri = checked;
    rebuildSvLayers();
    refreshUrl();
  }
);
createCheckBox("streetview-container", "photo-paths", "Show photo paths (thin lines only)", false, 
  (checked) => {
    options.showPhotoPaths = +checked;
    refreshUrl();
  }
);

document.querySelector("#map-style").addEventListener("change", (e) => {
  options.mapStyle = e.target.value;
  refreshUrl();
})

// END UI CODE
