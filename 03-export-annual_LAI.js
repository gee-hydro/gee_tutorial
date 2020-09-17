var pkg_export = require('users/kongdd/public:pkg_export.js');
var pkg_trend = require('users/kongdd/public:Math/pkg_trend.js');

// export parameters
var options = {
    type: "drive",
    range: [73, 25, 105, 40], //[-180, -60, 180, 90],
    cellsize: 1 / 10,
    // crsTransform : [463.312716528, 0, -20015109.354, 0, -463.312716527, 10007554.677], // prj.crsTransform;
    // scale        : 463.3127165275, // prj.scale
    crs: 'EPSG:4326', // 'SR-ORG:6974', // EPSG:4326
    folder: 'PMLV2'
};

function annual_max(imgcol, prefix){  
  imgcol = imgcol.filterDate('2003-01-01', '2017-12-31');
  imgcol = pkg_trend.imgcol_addSeasonProb(imgcol); 
  var imgcol_year = pkg_trend.aggregate_prop(imgcol, "Year", 'max');
  // print(imgcol_year);
  if (prefix) {
    // pkg_export.ExportImgCol(imgcol_year, null, options, prefix);
  } else {
    print("annual imgcol:", imgcol_year);
  }
  return imgcol_year;
}

// growing season (4:10) mean values
function annual_gs_mean(imgcol, prefix) {
  imgcol = imgcol.filterDate('2003-01-01', '2017-12-31');
  imgcol = pkg_trend.imgcol_addSeasonProb(imgcol)
      .filterMetadata('ingrow', 'equals', 'true');
  // print(imgcol.limit(3));
  var imgcol_year = pkg_trend.aggregate_prop(imgcol, "Year-ingrow", 'mean');
  // // print(imgcol_year);
  if (prefix) {
    // pkg_export.ExportImgCol(imgcol_year, null, options, prefix);
  } else {
    print("annual imgcol:", imgcol_year);
  }
  return imgcol_year;
}

function get_trend(imgcol_year, prefix) {
  // get trend
  var trend = pkg_trend.imgcol_trend(imgcol_year, 0, true).select('slope').multiply(1.5);
  // return trend;
  var max = -1;
  // Map.addLayer(trend, {min:-max, max:max, palette: ['green', 'white', 'red']}, prefix);
}

var imgcol_raw = ee.ImageCollection("MODIS/006/MCD15A3H").select('Lai');
var imgcol_smoothed = require('users/kongdd/gee_PML:src/mosaic_LAI.js').smoothed;

var imgcol_year_raw = annual_max(imgcol_raw, 'annual_LAI_raw_');
var imgcol_year_smoothed = annual_max(imgcol_smoothed, 'annual_LAI_smoothed_');

var imgcol_gs_raw      = annual_gs_mean(imgcol_raw, 'gs_mean_LAI_raw_');
var imgcol_gs_smoothed = annual_gs_mean(imgcol_smoothed, 'gs_mean_LAI_smoothed_');

// get_trend(imgcol_year_raw, 'trend_raw');
// get_trend(imgcol_year_smoothed, 'trend_smoothed');

// check the difference of smoothed and raw
Map.addLayer(imgcol_gs_raw.mean().divide(10), {min:0, max:1, palette: ['red', 'white', 'green']}, 'raw imgcol annual max');

// var pkg_join    = require('users/kongdd/public:pkg_join.js');
// var imgcol_diff = pkg_join.ImgColFun(imgcol_year_raw, imgcol_year_smoothed, pkg_join.Img_diff);

// // urgen: LAI was underestimated in whittaker
// Map.addLayer(imgcol_diff, {min:-10, max:10, palette: ['green', 'white', 'red']}, 'imgcol_diff');
// print(imgcol.size(), imgcol.limit(3), imgcol_year);
