//route /gps
const express = require('express')
const app = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = (coorGPS) => {
    app.get('/:uuid_user', (req, res) => {
        console.log(req.url)
        res.send("Connected to route gps")
    })

    app.post('/:uuid_user', (req, res) => {

        // create a new GPS coordinates
        var GpsCoord = coorGPS({
            uuid_user: req.params.uuid_user,
            timestamp: req.body.Timestamp,
            lattitude: req.body.Lattitude,
            longitude: req.body.Longitude,
            altitude: req.body.Altitude,
            heading: req.body.Heading,
            altitudeAccuracy: req.body.AltitudeAccuracy,
            speed: req.body.Speed
        });

        // Save a new GPS coordinates
        GpsCoord.save(function(err, gpsCoordonnees) {
            if (err) {
                throw err;
                res.status(500).end()
            } else {
                //console.log(gpsCoordonnees)
                let uuid = gpsCoordonnees.uuid_user
                console.log('GPS coordinates created! uuid = ' + uuid);
                res.setHeader('Location', '/gps/' + uuid);
                res.status(201).end()
            }

        });
    })

    return app
}