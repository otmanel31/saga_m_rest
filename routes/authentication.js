const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const express = require('express')
const expressJWT = require('express-jwt')
const config = require('config')
const User = require('../models').User // get our mongoose model

const authRoutes = express.Router()

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
authRoutes.post('/', function(req, res) {

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
                var token = jwt.sign(user, config.get('secret'), {
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
// send authenticated user data
// ---------------------------------------------------------
authRoutes.get('/check', function(req, res) {
    res.json(req.user)
})

module.exports = { routes: authRoutes}