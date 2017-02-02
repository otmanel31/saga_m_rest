//route /gps
const express = require('express')
const app = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = (coorGPS) => {
    app.get('/', (req, res) => {
        console.log(req.url)
        res.send("Connected to route gps")
    })

    app.post('/', (req, res) => {
        console.log(req.body)

        // create a new GPS coordinates
        var GpsCoord = coorGPS({
            timestamp: req.body.Timestamp,
            lattitude: req.body.Lattitude,
            longitude: req.body.Longitude,
            altitude: req.body.Altitude,
            heading: req.body.Heading,
            altitudeAccuracy: req.body.AltitudeAccuracy,
            speed: req.body.Speed
        });

        // Save a new GPS coordinates
        GpsCoord.save(function(err) {
            if (err) throw err;
            console.log('User created!');
        });
    })

    return app
}