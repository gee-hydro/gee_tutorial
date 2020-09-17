/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var srtm = ee.Image("CGIAR/SRTM90_V4");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var slope = ee.Terrain.slope(srtm);
Map.addLayer(srtm, {min:0, max:3000}, 'DEM');
Map.addLayer(slope, {min:0, max:60}, 'slope');
