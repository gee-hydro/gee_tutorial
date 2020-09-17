/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageCollection1 = ee.ImageCollection("LANDSAT/LC8_L1T"),
    geometry = /* color: d63000 */ee.Geometry.Polygon(
        [[[-121.39823913574219, 37.874988894932784],
          [-121.39823913574219, 37.87349836578598],
          [-121.38845443725586, 37.873362861640835],
          [-121.38914108276367, 37.874988894932784]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Array-based harmonic model fitting

var AMPLITUDE_THRESHOLD = 0.1;
var AMPLITUDE_MULTIPLIER = 5;
var start = '2014-01-01';
var end = '2015-01-01';

var phase_palette = [
  'cc6666',  // moderate red - peak beginning of Oct
  'cc9966',  // moderate orange - peak beginning of Sep
  'cccc66',  // moderate yellow - peak beginning of Aug
  '99cc66',  // moderate green - peak beginning of July
  '66cc66',  // moderate lime green - peak beginning of June
  '66cc99',  // moderate cyan - lime green - peak beginning of May
  '66cccc',  // moderate cyan - peak beginning of Apr
  '6699cc',  // moderate blue - peak beginning of Mar
  '6666cc',  // moderate blue/violet - peak beginning of Feb
  '9966cc',  // moderate violet - peak beginning of Jan
  'cc66cc',  // moderate magenta - peak beginning of Dec
  'cc6699',  // moderate pink - peak beginning of Nov
  'cc6666',  // moderate red - peak beginning of Oct
];
var phase_viz = {min:-Math.PI, max:Math.PI, palette:phase_palette};

// Filter out clouds.
function maskOutClouds(img) {
  var cloudscore = ee.Algorithms.Landsat.simpleCloudScore(img).select('cloud');
  return img.mask(cloudscore.lt(50));
}

// Add an NDVI band to an image.
function addNDVI(img) {
  return img.addBands(img.normalizedDifference(['B5', 'B4']).select([0],['NDVI']));
}


// Set up the "design matrix" to input to the regression.
function createLinearModelInputs(img) {
  var tstamp = ee.Date(img.get('system:time_start'));
  var tdelta = tstamp.difference(start, 'year');
  // Build an image that will be used to fit the equation
  // c0 + c1*sin(2*pi*t) + c2*cos(2*pi*t) = NDVI
  var img_fitting = img.select()
    .addBands(1)
    .addBands(tdelta.multiply(2*Math.PI).sin())
    .addBands(tdelta.multiply(2*Math.PI).cos())
    .addBands(img.select('NDVI'))
    .toDouble();
  return img_fitting;
}

// Estimate NDVI according to the fitted model.
function predictNDVI(img) {
  var tstamp = ee.Date(img.get('system:time_start'));
  var tdelta = tstamp.difference(start, 'year');
  // predicted NDVI = c0 + c1*sin(2*pi*t) + c2*cos(2*pi*t)
  var predicted = ee.Image(meanCoeff)
    .add(sinCoeff.multiply(tdelta.multiply(2*Math.PI).sin()))
    .add(cosCoeff.multiply(tdelta.multiply(2*Math.PI).cos()));
  return img.select('NDVI').addBands(predicted.select([0], ['fitted']));
}

var imgs = ee.ImageCollection('LANDSAT/LC8_L1T_TOA').filterDate(start, end);
imgs = imgs.map(maskOutClouds).map(addNDVI);
var design = imgs.map(createLinearModelInputs);

// Extract individual coefficients from the model.
var coeffs = design.reduce(ee.Reducer.linearRegression(3, 1)).select('coefficients');
var meanCoeff = coeffs.arrayGet([0,0]);
var sinCoeff = coeffs.arrayGet([1,0]);
var cosCoeff = coeffs.arrayGet([2,0]);
var phase = sinCoeff.atan2(cosCoeff);
var amplitude = sinCoeff.hypot(cosCoeff);

// Display the results
Map.setCenter(-121.2836, 37.9485, 11);
Map.addLayer(meanCoeff, {min:0, max:0.7}, 'NDVI fit - mean');
Map.addLayer(amplitude, {min:0, max:0.5}, 'NDVI fit - amplitude', false);

Map.addLayer(
    phase.mask(amplitude.subtract(AMPLITUDE_THRESHOLD).multiply(AMPLITUDE_MULTIPLIER)),
    phase_viz, 'NDVI fit phase');

var water = meanCoeff.lt(0);
water = water.mask(water);
Map.addLayer(water, {palette: ["4444aa"]}, 'water');

// Plot the result at the specified point.
var fitted = imgs.map(function(img) {
  var tstamp = ee.Date(img.get('system:time_start'));
  var tdelta = tstamp.difference(start, 'year');
  // predicted NDVI = c0 + c1*sin(2*pi*t) + c2*cos(2*pi*t)
  var predicted = ee.Image(meanCoeff)
    .add(sinCoeff.multiply(tdelta.multiply(2*Math.PI).sin()))
    .add(cosCoeff.multiply(tdelta.multiply(2*Math.PI).cos()));
  return img.select('NDVI').addBands(predicted.select([0], ['fitted']));
});

// Display the chart
print(Chart.image.series(fitted.select(['fitted', 'NDVI']), geometry, ee.Reducer.mean(), 200)
    .setChartType('LineChart')
    .setSeriesNames(['NDVI', 'fitted'])
    .setOptions({
      title: 'Original and fitted values',
      series: {
        0: {color: '0000FF'},
        1: {color: 'FF0000'}
      },
      lineWidth: 1,
      pointSize: 3,
}));