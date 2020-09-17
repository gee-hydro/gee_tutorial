/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA"),
    s2 = ee.ImageCollection("COPERNICUS/S2"),
    wuhan = /* color: #d63000 */ee.Geometry.Point([114.4103117512489, 30.66879248644885]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Landsat 8
var images = l8.select(['B2','B3','B4','B5'], ['B','G','R','N']);
var rgb_viz = {min:0, max:0.3, bands:['R','G','B']};

// // Sentinel 2
// var images = s2.select(['B2','B3','B4','B8'], ['B','G','R','N']);
// var rgb_viz = {min:0, max:2000, bands:['R','G','B']};

// images = images.filterDate('2015-01-01', '2016-01-01');
var images_2020 = images.filterDate('2020-01-01', '2021-01-01');
var images_2015 = images.filterDate('2015-01-01', '2016-01-01');
//images = images.filterBounds(geometry);

print('images.size()', images_2020.size());
// Map.addLayer(images, rgb_viz, 'True Color', false);
Map.addLayer(images_2020.median(), rgb_viz, 'True Color median', false);

function addNdwi(img) {
  var ndvi = img.normalizedDifference(['G', 'N']).rename('NDWI');
  return img.addBands(ndvi);
}
var ndwi_viz = {bands:"NDWI", min:0, max:0.3, palette:"000000,0000FF"};
var ndwi_2020 = images_2020.map(addNdwi);
var ndwi_2015 = images_2015.map(addNdwi);

Map.addLayer(ndwi_2020.max(), ndwi_viz, 'NDWI 2020');
Map.addLayer(ndwi_2015.max(), ndwi_viz, 'NDWI 2015');
Map.centerObject(wuhan, 12);