/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol = ee.ImageCollection("COPERNICUS/S2_SR"),
    wuhan = /* color: #d63000 */ee.Geometry.Point([114.29918916199806, 30.60499556938973]),
    point2 = /* color: #98ff00 */ee.Geometry.Point([114.5800779749879, 30.615312380133574]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// "RED", "NIR"
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['NIR', 'RED']).rename("NDVI"));
}

// QA60 Bitmask	
// Bit 10: Opaque clouds
    // 0: No opaque clouds
    // 1: Opaque clouds present
// Bit 11: Cirrus clouds
    // 0: No cirrus clouds
    // 1: Cirrus clouds present
var maskcloud1 = function(image) {
    var QA60 = image.select(['QA60']);
    return image.updateMask(QA60.lt(1));
};

imgcol = imgcol.select(['B4', 'B8'], ['RED', 'NIR'])
    .filterBounds(wuhan)
    .filterDate('2020-01-01', '2020-12-31');

imgcol = imgcol.map(addNDVI);
var img_max = imgcol.max().select('NDVI');
print(img_max);

var pkg_vis  = require('users/kongdd/public:pkg_vis.js');
var vis_vi   = {min: 0, max: 0.8, palette:pkg_vis.colors.RdYlGn[11]};
var lg_vi    = pkg_vis.grad_legend(vis_vi  , 'VI');

Map.addLayer(img_max, {min:0, max:0.6, palette: ['blue', 'grey', 'red', "green"]}, 'NDVI 2020 max')
Map.addLayer(img_max, vis_vi, 'NDVI 2020 max2')
// print(imgcol);

Map.centerObject(point2, 14);
