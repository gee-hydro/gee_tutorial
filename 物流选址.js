/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol = ee.ImageCollection("COPERNICUS/Landcover/100m/Proba-V-C3/Global"),
    imgcol_pop = ee.ImageCollection("WorldPop/GP/100m/pop"),
    point = /* color: #d63000 */ee.Geometry.Point([113.60755917187501, 23.141931619989013]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
imgcol = imgcol.select(['urban-coverfraction'])
print(imgcol)
Map.addLayer(imgcol, {palette: ['white', 'red'], min:0, max:50}, 'urban fraction')

imgcol_pop = imgcol_pop.filterBounds(point)
    .filterDate('2020-01-01').first();
print(imgcol_pop);
Map.addLayer(imgcol_pop, {palette: ['white', 'red'], min:0, max:1e3})
