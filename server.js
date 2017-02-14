const fs = require('fs')
const http = require('http')
const https = require('https')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const express = require('express')
const expressJWT = require('express-jwt')
const app = express()
const path = require('path')

const alerts = require('./routes/alerts')
const events = require('./routes/events')

const gps = require('./routes/location')
const authentication = require('./routes/authentication')

const models = require('./models')
const config = require('./config')

/*  =================================
    APP CONFIGURATION 
    =================================*/

// Mongo Database connection
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("connected on DB SAGA")
})
mongoose.connect(config.database)

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// use morgan to log requests to the console
app.use(morgan('dev'))
app.use(expressJWT({ secret: config.secret }.except({ routes: ['authentication', '/route/to/exclude'] })))

/*  =================================
    ROUTES
    =================================*/
app.use('/authenticate', authentication)
app.use('/alerts', alerts())
app.use('/location', gps(models.coorGPS))
app.use('/events', events(db))

/*  =================================
    DEVELOPMENT SETUP
    =================================*/
app.get('/setup', function(req, res) {

    // create a sample user
    let foo = new models.User({
        name: 'Bar',
        password: 'password',
        admin: false
    })

    // save the sample user
    foo.save(function(err) {
        if (err) throw err

        console.log('User saved successfully')
        res.json({ success: true })
    })
})

/*  =================================
    SERVER CONFIGURATION 
    =================================*/

// HTTPS credentials
const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8')
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)



httpServer.listen(8080, function() {
    console.log('Server HTTP started on port 8080')
})

httpsServer.listen(8443, function() {
    console.log('Server HTTPS started')
})
