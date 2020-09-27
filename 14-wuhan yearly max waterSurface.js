/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA"),
    s2 = ee.ImageCollection("COPERNICUS/S2"),
    wuhan = /* color: #d63000 */ee.Geometry.Point([114.4103117512489, 30.66879248644885]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var imgcol = l8.select(['B2','B3','B4','B5'], ['B','G','R','N'])
    .filterBounds(wuhan);
var rgb_viz = {min:0, max:0.3, bands:['R','G','B']};
// 1098233
print('all l8 images in wuhan', imgcol.size())
// print(l8.size());
// var img_count = l8.count();
// Map.addLayer(img_count, {}, 'landsat8 counts at each pixel');

// // Sentinel 2
// var images = s2.select(['B2','B3','B4','B8'], ['B','G','R','N']);
// var rgb_viz = {min:0, max:2000, bands:['R','G','B']};

function addNdwi(img) {
  var ndwi = img.normalizedDifference(['G', 'N']).rename('NDWI');
  return img.addBands(ndwi);
}
print(imgcol.limit(3))
// // images = images.filterDate('2015-01-01', '2016-01-01');
var images_2020 = imgcol.filterDate('2020-01-01', '2021-01-01')
    .map(addNdwi)
var img_2020 = images_2020.max();

var images_2015 = imgcol.filterDate('2015-01-01', '2016-01-01')
    .map(addNdwi)
var img_2015 = images_2015.max();


var ndwi_viz = {bands:"NDWI", min:0, max:0.3, palette:"000000,0000FF"};
// var ndwi_2020 = images_2020.map(addNdwi);
// var ndwi_2015 = images_2015.map(addNdwi);
Map.addLayer(img_2020, ndwi_viz, 'NDWI 2020');
Map.addLayer(img_2015, ndwi_viz, 'NDWI 2015');