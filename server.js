const fs = require('fs')
const http = require('http')
const https = require('https')

const express = require('express')
const app = express()
const path = require('path')

const alerts = require('./routes/alerts')

const privateKey = fs.readFileSync('sslcert/key.pem', 'utf8')
const certificate = fs.readFileSync('sslcert/cert.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }

// your express configuration here
// add middleware
app.use('/alerts', alerts())

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

httpServer.listen(8080, function() {
    console.log('Server HTTP started')
})

httpsServer.listen(8443, function() {
    console.log('Server HTTPS started')
})