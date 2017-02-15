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
    // GET  /alert/          : get all messages
    // GET  /alert/:uidUser  : get messages by uid
    // POST /alert/          : send message to all user
    // POST /alert/:uidUser  : send message to one user to Google cloud messaging and store in database mongodb
    //######################################

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
        var registrationToken = "eVsXE6yn_20:APA91bHHDDb7lJH-sK5bxbiDl2qJhIBO-KXGQvju5-RYg45ImNOr5lMq5VWeCm_mN4B3Tvg9DyXO_cKbwQqon0qICR5ZfAOCI0SHkgWSplqgbII7mLCje46t5rTZa-xzBIbyhMhMFlhc";


        admin.messaging().sendToDevice(registrationToken, payload)
            .then(function(response) {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.
                console.log("Successfully sent message:", response);
                res.status(201)
                res.send("Successfully sent message")



                // create a new alert
                var AlertMessage = Alert({
                    uuid_user: req.body.uuid_user,
                    title: req.body.title,
                    body: req.body.body
                });

                // Save a new alert in database
                AlertMessage.save(function(err, AlertSended) {
                    if (err) {
                        throw err;
                        res.status(500).end()
                    } else {
                        let uuid = AlertSended.uuid_user
                        console.log('New alert created! uuid = ' + uuid);
                    }
                })

            }).catch(function(error) {
                console.log("Error sending message:", error);
            });
    })


    return app
}