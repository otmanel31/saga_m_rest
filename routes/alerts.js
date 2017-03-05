'mode strict'
//route /alerts
const express = require('express')
const app = express.Router()
const inspect = require('util').inspect


module.exports = (Alert) => {

    //######################################
    // GET   /alert/self                     : get alert about the owner of uid user (uid contains in req header)
    // PATCH /alert/self/ack/:uidAck         : Update Acknowledge alert 
    //######################################



    /*-------------------------------------------
     GET message only uidUser
     -------------------------------------------*/
    app.get('/self', (req, res) => {
        //console.log(inspect(req.headers))
        //console.log(req.user._doc._id)
        Alert.find({ uuid_user: req.user._doc._id }, function(err, alert) {
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

    app.patch('/self/ack/:uidAlert', function(req, res) {
        let uidUser = req.user._doc._id;
        // find 
        Alert.findByIdAndUpdate(req.params.uidAlert, { ack: true }, function(err, doc) {
            if(uidUser == doc.uuid_user){
                res.status(200)
                res.send("Patch OK")
            } else {
                // uidUser not exist
                res.status(404)
                res.send('Alert associated with user doesn\'t exist ')
            }

        })
    })


    return app
}