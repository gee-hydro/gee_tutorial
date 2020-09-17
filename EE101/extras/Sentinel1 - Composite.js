
var pol = 'VV';

var imgVV = ee.ImageCollection('COPERNICUS/S1_GRD').
 filter(ee.Filter.eq('transmitterReceiverPolarisation', pol)).
 filterMetadata('instrumentMode', 'equals', 'IW'); 

print('scale', ee.Image(imgVV.first()).select(pol).projection().nominalScale());
print('projection', ee.Image(imgVV.first()).select(pol).projection());

var imgDspring = imgVV.filterDate('2015-03-01', '2015-04-20').filterMetadata('orbitProperties_pass', 'equals', 'DESCENDING').select(pol);
var imgDlatespring = imgVV.filterDate('2015-04-21', '2015-06-10').filterMetadata('orbitProperties_pass', 'equals', 'DESCENDING').select(pol);
var imgDsummer = imgVV.filterDate('2015-06-11', '2015-08-31').filterMetadata('orbitProperties_pass', 'equals', 'DESCENDING').select(pol);

var imgAspring = imgVV.filterDate('2015-03-01', '2015-04-20').filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING').select(pol);
var imgAlatespring = imgVV.filterDate('2015-04-21', '2015-06-10').filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING').select(pol);
var imgAsummer = imgVV.filterDate('2015-06-11', '2015-08-31').filterMetadata('orbitProperties_pass', 'equals', 'ASCENDING').select(pol);

var maskEdge = function(image) {
  var edge = image.lt(-30.0);
  var maskedImage = image.mask().and(edge.not());
  return image.mask(maskedImage);
};

var aChange = imgAspring.map(maskEdge).mean()
    .addBands(imgAlatespring.map(maskEdge).mean())
    .addBands(imgAsummer.map(maskEdge).mean());

var dChange = imgDspring.map(maskEdge).mean()
    .addBands(imgDlatespring.map(maskEdge).mean())
    .addBands(imgDsummer.map(maskEdge).mean());

Map.addLayer(aChange, {min: -25, max: 5}, "Multi-T Mean ASC", true);
Map.addLayer(dChange, {min: -25, max: 5}, "Multi-T Mean DESC", true);
