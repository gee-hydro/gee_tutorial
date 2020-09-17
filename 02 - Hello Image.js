/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var img = ee.Image("USGS/SRTMGL1_003");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// begin from MODIS LAI
print(img)
Map.addLayer(img, {min:0, max:3000});
