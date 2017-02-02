const express = require('express')
const app = express()
const path = require('path')
const alerts = require('./routes/alerts')
const gps = require('./routes/gps')
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

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("connected on DB SAGA")
})
mongoose.connect('mongodb://localhost/saga')

// Define ROUTE
app.use('/alerts', alerts())
app.use('/gps', gps(coorGPS))

// Server connection
const server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)

})