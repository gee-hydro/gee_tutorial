// Load the Sentinel1 collection.
var sentinel = ee.ImageCollection('COPERNICUS/S1_GRD');

// Polarization band names.
var pol = ['VV', 'VH'];

// Filter the collection down to a certain polarization and time range.
var img = sentinel
    .filter(ee.Filter.eq("orbitProperties_pass", 'DESCENDING'))
    .filter(ee.Filter.eq('transmitterReceiverPolarisation', pol))
    .filterDate('2015-06-01', '2015-07-24')
    .select(pol);

print(img.first());
var percentile = img.median();
var minusPercentile = img
  .map(function(img) {
    img = img.addBands(img.select(0).divide(img.select(1)).rename("ratio"));
    return img.addBands(ee.Image(1).subtract(img.select(0).subtract(percentile.select(0)).abs()).rename('best')).resample();
  });
var scaled = minusPercentile.qualityMosaic('best');
  
// Scale the images, then find the median.
/*
var scaled = img.map(scalingFunction)
    .map(function(img) {
      //return img.addBands(img.select(0).divide(img.select(1)).rename("ratio"));
      return img.addBands(img.select(0))
    }).reduce(ee.Reducer.max(3).setOutputs(['VV', 'VH', 'ratio']));
*/
// Mask out values where the value is over a threshold.
var result = scaled.mask(scaled.gt(-30));

// ref: http://webmap.ornl.gov/wcsdown/dataset.jsp?ds_id=993
// Bands HH (red and green) and Band-HV (blue) can be used to visualize 
// land use patterns. The resulting images show vegetation in shades of 
// green and barren land in shades of pink or purple.
// Map.addLayer(img, {
//     bands:['HV','HH','HV'],
//     min:  [-25,-18,-25],
//     max:  [ -3,  5, -3]
//   }, 'HH - HV');

Map.addLayer(result, {bands:'VV', min:-20, max:-3}, 'VV', false);
Map.addLayer(result, {bands:'VH', min:-20, max:-13}, 'VH', false);
Map.addLayer(result, {
    bands:['VV','VH','ratio'],
    min:  [-20,-17,-5],
    max:  [ 0,  -9, 5],
    format: 'png'
  }, 'VV - VH');
  
Map.setCenter(14.424, 40.8221, 12)