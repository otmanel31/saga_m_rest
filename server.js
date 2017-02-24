const fs = require('fs')
const http = require('http')
const https = require('https')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const express = require('express')
const expressJWT = require('express-jwt')
const config = require('config')
const path = require('path')

const app = express()

const alerts = require('./routes/alerts')
const events = require('./routes/events')

const gps = require('./routes/location')
const authentication = require('./routes/authentication')

const models = require('./models')
const jwtCheckMiddleware = expressJWT({ secret: config.get('secret') }).unless({ path: ['/authenticate'] })

// dev mode databse initialisation
const setupDev = require('./setup_dev')


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

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('dev'))
}

/*  =================================
    DEVELOPMENT SETUP
    =================================*/
if (config.util.getEnv('NODE_ENV') === 'dev') {
    app.get('/setup', function(req, res) {
        console.log('/setup')
        setupDev(function(err, message) {
            if (err) res.sendStatus(500)
            res.json(message)
        })
    })
}

/*  =================================
    PULIC ROUTES
    =================================*/
app.use('/authenticate', jwtCheckMiddleware, authentication.routes)

/*  =================================
    PRIVATE ROUTES
    =================================*/
app.use('/alerts', jwtCheckMiddleware, alerts(models.Alert, models.User))
app.use('/location', jwtCheckMiddleware, gps(models.coorGPS))
app.use('/events', events(db))

// Global error handling
app.use(function(err, req, res, next) {
    // JWT Error handling
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
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

// for unit testing
module.exports = httpServer;