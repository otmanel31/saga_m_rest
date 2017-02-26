//route /location
const express = require('express')
const app = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = (coorGPS) => {

    //######################################
    // POST /location/:uidUser  : send GPS coordinate in database mongodb
    //######################################

    app.post('/:uuid_user', (req, res) => {
        // test body is defined
        if (req.body.Timestamp && req.body.Lattitude && req.body.Longitude) {
            // create a new GPS coordinates
            var GpsCoord = coorGPS({
                uuid_user: req.params.uuid_user,
                timestamp: req.body.Timestamp * 1000,
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
                    res.setHeader('Location', '/location/' + uuid);
                    res.status(201).end()
                }

            });

        } else {
            // send error if body is undefined
            res.status(400).end('Body contains not enough informations')

        }

    })

    return app
}