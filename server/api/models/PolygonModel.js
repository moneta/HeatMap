'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PolygonSchema = new Schema({
  user: String,
  locations: [{ lat: Number, lng: Number }],
});

module.exports = mongoose.model('Polygons', PolygonSchema);

// db.createCollection("Polygons", { capped: true, autoIndexId: true, size : 5242880, max : 5000 } );
// db.Polygons.insert({ user: 'Vle', locations: [{ lat: 37.77668498313053, lng: -122.46339797973633 }, { lat: 37.80476580072879, lng: -122.43232727050781 }, { lat: 37.79323632157157, lng: -122.38460540771484 }, { lat: 37.74262098278526, lng: -122.39044189453125 }, { lat: 37.740992032124666, lng: -122.43833541870117 }] })
// db.Polygons.find({ user: "Vle" })