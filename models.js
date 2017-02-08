const mongoose = require('mongoose');

//schema database
var GpsSchema = mongoose.Schema({
    uuid_user: Number,
    timestamp: Date,
    lattitude: Number,
    longitude: Number,
    altitude: Number,
    altitudeAccuracy: Number,
    heading: Number,
    speed: Number,
});

var coorGPS = mongoose.model('CoordGPS', GpsSchema);

module.exports = { coorGPS: coorGPS }