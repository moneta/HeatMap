'use strict';

var mongoose = require('mongoose');
var Polygons = require('../models/PolygonModel');

exports.list_all_polygons = function(req, res) {
  var mongoDBNotInstalledYet = true;

  if (mongoDBNotInstalledYet) {
    const polygon = {
      status: 'OK',
      data:[
        [
          { lat: 37.77668498313053, lng: -122.46339797973633 },
          { lat: 37.80476580072879, lng: -122.43232727050781 },
          { lat: 37.79323632157157, lng: -122.38460540771484 },
          { lat: 37.74262098278526, lng: -122.39044189453125 },
          { lat: 37.740992032124666, lng: -122.43833541870117 },
        ],
      ],
    };

    res.json(polygon);
  } else {
    var query = Polygons.find({ user: "Vle" });
    query.select('_id');
    query.exec((err, poly) => {
      console.log('polygon:', poly);
      if (err) {
        res.send(err);
      }

      res.json(poly);
    });
  }
};


exports.create_a_polygon = function(req, res) {
  var new_polygon = new Polygons(req.body);
  new_polygon.save(function(err, polygon) {
    if (err) {
      res.send(err);
    }

    res.json(polygon);
  });
};


exports.read_a_polygon = function(req, res) {
  Polygons.findById(req.params.polygonId, function(err, polygon) {
    if (err) {
      res.send(err);
    }

    res.json(polygon);
  });
};


exports.update_a_polygon = function(req, res) {
  Polygons.findOneAndUpdate({_id: req.params.polygonId}, req.body, {new: true}, function(err, polygon) {
    if (err) {
      res.send(err);
    }

    res.json(polygon);
  });
};


exports.delete_a_polygon = function(req, res) {
  Polygons.remove({
    _id: req.params.polygonId
  }, function(err, polygon) {
    if (err) {
      res.send(err);
    }

    res.json({ message: 'polygon successfully deleted' });
  });
};