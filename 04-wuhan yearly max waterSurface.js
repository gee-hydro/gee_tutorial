/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var landsat8 = ee.ImageCollection("LANDSAT/LC8_L1T_TOA"),
    s2 = ee.ImageCollection("COPERNICUS/S2"),
    wuhan = /* color: #d63000 */ee.Geometry.Point([114.4103117512489, 30.66879248644885]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Landsat 8
var images = landsat8.select(['B2','B3','B4','B5'], ['B','G','R','N']);
var rgb_viz = {min:0, max:0.3, bands:['R','G','B']};

// // Sentinel 2
// var images = s2.select(['B2','B3','B4','B8'], ['B','G','R','N']);
// var rgb_viz = {min:0, max:2000, bands:['R','G','B']};

images = images.filterDate('2015-01-01', '2016-01-01');
//images = images.filterBounds(geometry);

print('images.size()', images.size());
Map.addLayer(images, rgb_viz, 'True Color', false);
Map.addLayer(images.median(), rgb_viz, 'True Color median', false);

function addNdwi(img) {
  var ndvi = img.normalizedDifference(['G', 'N']).rename('NDWI');
  return img.addBands(ndvi);
}
var ndwi_viz = {bands:"NDWI", min:0, max:0.3, palette:"000000,0000FF"};
var withNdwi = images.map(addNdwi);
Map.addLayer(withNdwi.max(), ndwi_viz, 'NDVI');

Map.centerObject(wuhan, 12);