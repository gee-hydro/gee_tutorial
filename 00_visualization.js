/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imgcol = ee.ImageCollection("projects/pml_evapotranspiration/PML/OUTPUT/PML_V2_yearly_v016");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var pkg_vis = require('users/kongdd/public:pkg_vis.js');

var vis_et = { min: 100, max: 1600, palette: pkg_vis.colors.RdYlBu[11] };
var lg_et = pkg_vis.grad_legend(vis_et, 'ET', false); 

var vis_gpp     = {min: 100, max: 3500, palette:pkg_vis.colors.RdYlGn[11]};
var lg_gpp      = pkg_vis.grad_legend(vis_gpp, 'GPP', false); 
pkg_vis.add_lgds([lg_et, lg_gpp]);

Map.addLayer(imgcol.select("GPP"), vis_gpp, 'GPP');
Map.addLayer(imgcol.select("Ec"), vis_et, 'Ec');
