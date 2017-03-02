'mode strict'
//route /alerts
const express = require('express')
const app = express.Router()
const admin = require("firebase-admin")


//Path key private service Account 
const serviceAccount = require("../../../key_FCM/saga-m-firebase-adminsdk-f127j-45c43b1170.json")

//
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://saga-m.firebaseio.com"
});


module.exports = (Alert, Users) => {

    //######################################
    // GET   /alert/                     : get all messages
    // GET   /alert/:uidUser             : get messages by uid
    // POST  /alert/:uidUser             : send message to one user to Google cloud messaging and store in database mongodb
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
        // It is stored when a user has logged
        Users.findById(req.params.uidUser, function(err, user) {
            if (err) {
                res.status(404).end('User not found')
            } else {
                console.log(user)
                if (!user.tokenGCM) {
                    console.log("echec")
                    res.status(404).end()
                } else {
                    // Get token Google Cloud messaging in database
                    var registrationToken = user.tokenGCM;
                    console.log("token GCM : " + registrationToken)

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
                                ack: false
                            });

                            // Save a new alert in database
                            AlertMessage.save(function(err, AlertSaved) {
                                if (err) {
                                    throw err;
                                    res.status(500).end()
                                } else {
                                    console.log('New alert created! uuid = ' + AlertSaved._id);
                                    res.location("/alert/" + AlertSaved._id);
                                    res.status(201)
                                    res.send("Successfully sent message")
                                }
                            })

                        }).catch(function(error) {
                            console.log("Error sending message:", error);
                        });


                }
            }
        })

    })


    return app
}