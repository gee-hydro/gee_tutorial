/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var filtered = L8.filterDate('2016-05-01', '2016-05-15');

var rgb_vis = {
  min: 0,
  max: 0.3,
  gamma: 1.5,
  bands: ['B4', 'B3', 'B2']
};

Map.addLayer(filtered, rgb_vis, 'RGB');
Map.addLayer(filtered, {min: 0, max: 0.3, bands: ['B5', 'B4', 'B3']}, 'False Color');
