/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = /* color: bf04c2 */ee.Geometry.Point([-122.28950500488281, 37.87055532905743]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Classification stub.  Draw points by hand by clicking the point
// icon in the geometry drawing tools.  Click '+new layer' to make
// three sets of points, each set representing samples from classes:
// 'urban', 'vegetation', 'water' (in that order).

// For each set of points in the imports, click the gear icon and 
// 'Import as' FeatureCollection.  Also add a property called 
// 'landcover' and set a consecutive integer starting from 0 for 
// the first class.

// Load Landsat 8 TOA images, get the least cloudy 2015 image.
var image = ee.Image(ee.ImageCollection('LANDSAT/LC8_L1T_TOA')
    // Geographically filter.
    .filterBounds(roi)
    // Filter to get only 2015.
    .filterDate('2015-01-01', '2015-12-31')
    // Sort by cloud cover metadata (ascending).
    .sort('CLOUD_COVER')
    // Get the least cloudy image.
    .first());

// Display the input imagery.
Map.centerObject(roi, 11);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'Landsat image');

// Merge the hand-drawn features into a single FeatureCollection.
var newfc = urban.merge(vegetation).merge(water);

// Use these bands in the prediction.
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];

// Make training data by 'overlaying' the points on the image.
var training = image.select(bands).sampleRegions({
  collection: newfc, 
  properties: ['landcover'], 
  scale: 30
});

// Get a CART classifier and train it.
var classifier = ee.Classifier.cart().train({
  features: training, 
  classProperty: 'landcover', 
  inputProperties: bands
});

// Classify the image.
var classified = image.select(bands).classify(classifier);

// Display the classification results.
Map.addLayer(classified, {min: 0, max: 2, palette: ['red', 'green', 'blue']}, 'classification');

