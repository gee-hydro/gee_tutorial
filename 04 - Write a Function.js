/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA"),
    roi = /* color: #98ff00 */ee.Geometry.Point([-122.10205078125, 37.43125050179359]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var rgb_vis = {
  min: 0,
  max: 0.3,
  gamma: 1.5,
  bands: ['B4', 'B3', 'B2']
};

function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']);
  return image.addBands(ndvi);
}
var filtered = L8.filterDate('2016-05-01', '2016-05-15')
    .filterBounds(roi);

var image = ee.Image(filtered.first());
var ndvi = addNDVI(image);
Map.addLayer(image, rgb_vis, 'RGB');
Map.addLayer(ndvi, {bands:'nd', min:0, max:1}, 'NDVI');

