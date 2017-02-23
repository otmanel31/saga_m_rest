'mode strict'
//route /alerts
const express = require('express')
const app = express.Router()
const admin = require("firebase-admin")


//Path key private service Account 
const serviceAccount = require("../../key_FCM/saga-m-firebase-adminsdk-f127j-45c43b1170.json")

//
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://saga-m.firebaseio.com"
});


module.exports = (Alert) => {

    //######################################
    // GET  /alert/                     : get all messages
    // GET  /alert/:uidUser             : get messages by uid
    // POST /alert/:uidUser             : send message to one user to Google cloud messaging and store in database mongodb
    // PUT  /alert/:uidUser/ack/:uidAck : Update Acknowledge alert to uidUser
    //######################################

    /*-------------------------------------------
     GET all messages
     -------------------------------------------*/
    app.get('/', (req, res) => {
        Alert.find({}, function(err, alert) {
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
     External API for SAGA
     Post an alert on only uidUser
     format body :
        {
            title : xxxxx
            body  : xxxxx
        }
     -------------------------------------------*/
    app.post('/:uidUser', function(req, res) {
        // Send a message to the device corresponding to the provided
        // registration token.

        // See the "Defining the message payload" section below for details
        // on how to define a message payload.
        var payload = {
            notification: {
                title: req.body.title,
                body: req.body.body
            }
        };

        // This registration token comes from the client FCM SDKs.
        // It is stored when authentification

        var registrationToken = "";


        // send message to device with registrationToken
        admin.messaging().sendToDevice(registrationToken, payload)
            .then(function(response) {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.

                // create a new alert
                var AlertMessage = Alert({
                    uuid_user: req.body.uuid_user,
                    title: req.body.title,
                    body: req.body.body,
                    ack: False
                });

                // Save a new alert in database
                AlertMessage.save(function(err, AlertSended) {
                    if (err) {
                        throw err;
                        res.status(500).end()
                    } else {
                        console.log('New alert created! uuid = ' + AlertSended._id);
                        res.location("/alert/" + AlertSended._id);
                        res.status(201)
                        res.send("Successfully sent message")
                    }
                })

            }).catch(function(error) {
                console.log("Error sending message:", error);
            });
    })


    /*-------------------------------------------
     Acknowlege Alert
     -------------------------------------------
     Recieve in body : acknowledge : true or false */

    app.patch('/ack/:uidAlert', function(req, res) {
        let ack = req.body.acknowledge

        // find 
        //Alert.findOneAndUpdate({ _id: req.params.uidAlert }, )


    })


    return app
}