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
const inspect = require('util').inspect

const app = express()

const sagaAlert = require('./routes/saga_routes/saga_alerts')
const sagaLocation = require('./routes/saga_routes/saga_location')
const sagaUsers = require('./routes/saga_routes/saga_users')

const alerts = require('./routes/alerts')
const events = require('./routes/events')
const location = require('./routes/location')
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
        setupDev(function(err, message) {
            if (err) res.sendStatus(500)
            res.json(message)
        })
    })
}
// Midleware for CORS enable
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers","Authorization, Content-Type");
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","PATCH,GET,POST");
  next();
});

/*  =================================
    PULIC ROUTES
    =================================*/
app.use('/authenticate', jwtCheckMiddleware, authentication.routes)

let log_middleware = function (req, res, next) {
    console.log('Log Midleware !!!!')
    console.log(inspect(req.body))
    next()
}

/*  =================================
    PRIVATE ROUTES
    =================================*/
app.use('/alerts',  jwtCheckMiddleware, alerts(models.Alert))
app.use('/location', jwtCheckMiddleware, location(models.coorGPS))
app.use('/events',log_middleware, jwtCheckMiddleware, events(db))

/*  =================================
    SAGA ROUTES
    =================================*/
app.use('/saga/alerts', log_middleware, sagaAlert( models.Alert, models.User))
app.use('/saga/location', sagaLocation(models.coorGPS))
app.use('/saga/users', sagaUsers(models.User))


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
