const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const express = require('express')
const config = require('../config')
const User = require('../models').User // get our mongoose model

const authRoutes = express.Router()

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
authRoutes.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' })
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' })
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                })

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                })
            }

        }

    })
})

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
authRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token']

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' })
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded
                next()
            }
        })

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })

    }

})

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
authRoutes.get('/check', function(req, res) {
    res.json(req.decoded)
})

module.exports = authRoutes