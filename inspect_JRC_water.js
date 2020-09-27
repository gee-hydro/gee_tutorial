/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol_month = ee.ImageCollection("JRC/GSW1_2/MonthlyRecurrence"),
    point = /* color: #d63000 */ee.Geometry.MultiPoint(),
    CUG_new = /* color: #98ff00 */ee.Geometry.Point([114.61045045815844, 30.46032968570748]),
    image = ee.Image("JRC/GSW1_2/GlobalSurfaceWater"),
    image2 = ee.Image("JRC/GSW1_2/Metadata"),
    imgcol = ee.ImageCollection("JRC/GSW1_2/YearlyHistory"),
    sanxia = /* color: #0b4a8b */ee.Geometry.Point([110.99863422257333, 30.818582628642492]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// print(imgcol_month);

// Map.addLayer(imgcol)
// Map.centerObject(CUG_new, 16)
// Map.addLayer(image); 

var ui_date_begin = ui.DateSlider({
    start: '1984-01-01',
    end: '2019-12-31',
    period: 365,
    onChange: OnChange_date
});

var ui_date_end = ui.DateSlider({
    start: '1984-01-01',
    end: '2019-12-31',
    period: 365,
    onChange: OnChange_date
});

function OnChange_date() {
    var date_begin = ui_date_begin.getValue()[0]; // begin from 0
    var date_end = ui_date_end.getValue()[0]; // begin from 0

    var img_begin = imgcol.filterDate(date_begin).first();
    var img_end = imgcol.filterDate(date_end).first();
    
    // print(date_begin, date_end);
    var dateStr_begin = ee.Date(date_begin).format("YYYY-MM-dd").getInfo();
    var dateStr_end = ee.Date(date_end).format("YYYY-MM-dd").getInfo();

    Map.clear();
    Map.addLayer(img_end, vis_end, dateStr_end, true, 0.5);
    Map.addLayer(img_begin, vis_begin, dateStr_begin);
    // print(ee.Date(date_begin[1]), ee.Date(date_begin[0]))
    // print(ee.Date(date_begin[0]));
}

var vis_begin = { min: 0, max: 3, palette: ['#cccccc', '#ffffff', '#99d9ea', 'blue'] };
var vis_end = { min: 0, max: 3, palette: ['#cccccc', '#ffffff', 'yellow', 'red'] };

print("date_begin", ui_date_begin);
print("date_end", ui_date_end);
ui_date_begin.setValue('2018-01-01');
// ui_date_begin.setValue('2020-01-01');
// print(imageCollection);
// Map.addLayer(imageCollection.first(), )
