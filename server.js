const fs = require('fs')
const http = require('http')
const https = require('https')
var bodyParser = require('body-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');

const express = require('express')
const app = express()
const path = require('path')

const alerts = require('./routes/alerts')
const gps = require('./routes/location')
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

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

/*  =================================
    ROUTES
    =================================*/
app.use('/alerts', alerts())
app.use('/location', gps(models.coorGPS))


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
    console.log('Server HTTP started')
})

httpsServer.listen(8443, function() {
    console.log('Server HTTPS started')
})