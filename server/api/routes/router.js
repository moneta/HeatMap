'use strict';

module.exports = function(router) {
  const heatmap = require('../controllers/heatmapController');

  router.route('/polygons')
    .get(heatmap.list_all_polygons)
    .post(heatmap.create_a_polygon);


  router.route('/polygons/:polygonId')
    .get(heatmap.read_a_polygon)
    .put(heatmap.update_a_polygon)
    .delete(heatmap.delete_a_polygon);

  return router;
};
