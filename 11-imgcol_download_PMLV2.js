/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol_d = ee.ImageCollection("projects/pml_evapotranspiration/landcover_impact/PMLV2_yearly_v016_dynamic"),
    imgcol_s = ee.ImageCollection("projects/pml_evapotranspiration/landcover_impact/PMLV2_yearly_v016_static"),
    imgcol_8d = ee.ImageCollection("projects/pml_evapotranspiration/PML/OUTPUT/PML_V2_8day_v016");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/**
 * Copyright (c) 2019 Dongdong Kong. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
var pkg_export = require('users/kongdd/public:pkg_export.js');
// var pkg_trend  = require('users/kongdd/public:Math/pkg_trend.js');
// export parameters
var options = {
    type: "drive", // assets, drive
    range: [-180, -60, 180, 90], // [lon_min, lat_min, lon_max, lat_max], 
    cellsize: 1 / 10,
    // crsTransform : [463.312716528, 0, -20015109.354, 0, -463.312716527, 10007554.677], // prj.crsTransform;
    // scale        : 463.3127165275, // prj.scale
    crs: 'EPSG:4326', // 'SR-ORG:6974', // EPSG:4326
    folder: 'PMLV2'
};


imgcol_8d = imgcol_8d.select([0, 1, 2, 3, 4, 5]);
// print(imgcol_8d.size());
// pkg_export.ExportImgCol(imgcol_d, null, options, 'PMLV2_veg-dynamic_');
// pkg_export.ExportImgCol(imgcol_s, null, options, 'PMLV2_veg-static_');
// pkg_export.ExportImgCol(imgcol_8d.limit(3), null, options, 'PMLV2_latest_');

var imgcol = imgcol_8d;
imgcol = imgcol.limit(46); // 46
print(imgcol);

var img = imgcol.toBands();
print(img)

// (Image, task, options)
// export parameters
var options = {
    type: "drive", // assets, drive
    range: [70, 15, 140, 55], // [lon_min, lat_min, lon_max, lat_max], 
    cellsize: 1 / 10,
    // crsTransform : [463.312716528, 0, -20015109.354, 0, -463.312716527, 10007554.677], // prj.crsTransform;
    // scale        : 463.3127165275, // prj.scale
    crs: 'EPSG:4326', // 'SR-ORG:6974', // EPSG:4326
    folder: 'PMLV2'
};
pkg_export.ExportImg(img, 'PMLV2_multiBands_', options);




/** second solution --------------------------------------------------------- */
// export bandnames
// var date = imgcol_8d.aggregate_array("system:time_start")
//     .map(function (x) { return (ee.Date(x)) });
// print(date)
// var bandnames = img.bandNames();
// var f = ee.FeatureCollection(ee.Feature(null, {bandname: bandnames}));
// var task_bandname = task.concat('names');
// Export.table.toDrive(f, task_bandname, 'PMLV2', task_bandname, "CSV");
