export const LayerType = Object.freeze({
  Road: 0,
  Satellite: 1,
  Overlay: 2,
  TerrainAll: 4,
  TerrainRelief: 5,
  TerrainContours: 6,
  None: 99999,
});

export const ToggleType = Object.freeze({
  Normal: 1,

  HighDpi: 2,

  /** No text or icons are displayed. */ 
  NoLabels: 3,

  SatelliteOverlay: 4,

  BigRoadIcons: 13,

  LabelsAndIconsOnly: 15,

  WhiteRoads: 21,

  StreetViewDarkBlue: 40,

  /** Google Maps uses this style if terrain is enabled. */ 
  WhiteAndGrayRoads: 63,

  NoLandUse: 64,

  /** Enables the terrain overlay in conjunction with adding base layers 5 and 6. */
  Terrain: 67,

  /** Enables the Street View overlay for the Satellite layer. */ 
  StreetView: 68,
});

export const RasterType = Object.freeze({
  PNG: 0,
  JPG: 1,
  GIF: 2,
  WEBP: 3,
  DDS: 4,
});
