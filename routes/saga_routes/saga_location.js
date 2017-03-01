//route /location
const express = require('express')
const app = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = (coorGPS) => {

    //######################################
    // GET  /location/          : get all GPS coordinate
    // GET  /location/:uidUser  : get location by uidUser
    //######################################

    //---------------------------------------
    // Get all location in database (GET /location)
    //---------------------------------------
    app.get('/', (req, res) => {
        coorGPS.find(null, function(err, allcoord) {
            if (err) {
                throw err;
                res.status(404).end()
            } else {
                res.status(200)
                res.send(allcoord).end()
            }
        })
    })

    //---------------------------------------
    // Get location by id in database (GET /location/:uuidUser)
    //---------------------------------------
    app.get('/:uuidUser', (req, res) => {
        let uuidUser = req.params.uuidUser
        coorGPS.find({ uuid_user: uuidUser }, function(err, coordOneUser) {
            if (err) {
                throw err;
                res.status(404).end()
            } else {
                res.status(200)
                res.send(coordOneUser).end()
            }
        })
    })

    return app
}