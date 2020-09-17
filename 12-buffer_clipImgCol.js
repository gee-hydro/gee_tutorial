/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol_terraClimate = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE"),
    imageCollection2 = ee.ImageCollection("NASA/ORNL/DAYMET_V3"),
    imageCollection3 = ee.ImageCollection("WORLDCLIM/V1/MONTHLY"),
    st_212 = ee.FeatureCollection("projects/pml_evapotranspiration/shp/phenofit/st212"),
    imgcol_MOD15A2 = ee.ImageCollection("MODIS/006/MOD15A2H");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// print(imgcol_terraClimate.limit(3));
var pkg_buffer = require('users/kongdd/public:pkg_buffer.js');

// print(st_212)
var options = {
    reducers : ['first'],  // 1th: non-buffer; 2th: buffer; Only one means no buffer
    buffer   : false,      // whether to use buffer
    list     : false, 
    folder   : '', // drive forder
    fileFormat: 'csv'      // 'csv' or 'geojson'
};
// pkg_buffer.spClipImgCol(imgcol_terraClimate, st_212, "terraClimate", options);
pkg_buffer.spClipImgCol(imgcol_MOD15A2, st_212, "flux212_MOD15A2", options);
