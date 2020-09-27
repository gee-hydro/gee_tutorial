/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var img = ee.Image("USGS/SRTMGL1_003"),
    imgcol = ee.ImageCollection("MODIS/006/MOD13A2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// begin from MODIS LAI
// print(img)
// Map.addLayer(img, {min:0, max:3000});

imgcol = imgcol.filterDate("2020-01-01", '2020-12-31')
    .select(['EVI']);

print(imgcol);

var pkg_vis  = require('users/kongdd/public:pkg_vis.js');
// gradient legend
var vis_vi   = {min: 0, max: 5000, palette:pkg_vis.colors.RdYlGn[11]};
var lg_vi    = pkg_vis.grad_legend(vis_vi, 'NDVI');
    
Map.addLayer(imgcol, vis_vi, '2020 EVI')
