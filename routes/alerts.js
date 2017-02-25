'mode strict'
//route /alerts
const express = require('express')
const app = express.Router()


module.exports = (Alert, Users) => {

    //######################################
    // GET   /alert/:uidUser             : get messages by uid
    // PATCH /alert/:uidAck              : Update Acknowledge alert 
    //######################################


    /*-------------------------------------------
     GET message only uidUser
     -------------------------------------------*/
    app.get('/:uidUser', (req, res) => {
        Alert.find({ uuid_user: req.params.uidUser }, function(err, alert) {
            if (err) {
                throw err;
                res.status(404).end()
            } else {
                res.status(200)
                res.send(alert).end()
            }
        })
    })


    /*-------------------------------------------
     Acknowlege Alert
     -------------------------------------------
     Receive in body : acknowledge : true or false */

    app.patch('/ack/:uidAlert', function(req, res) {
        let ack_save = req.body.acknowledge

        // find 
        Alert.findByIdAndUpdate(req.params.uidAlert, { ack: ack_save }, function(err, doc) {
            res.status(200)
            res.send("Patch OK")
        })
    })


    return app
}