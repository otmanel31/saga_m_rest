const express = require('express')
const app = express()
const path = require('path')
const alerts = require('./routes/alerts')
const gps = require('./routes/location')
const mongoose = require('mongoose');
const models = require('./models')


var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("connected on DB SAGA")
})
mongoose.connect('mongodb://localhost/saga')

// Define ROUTE
app.use('/alerts', alerts())
app.use('/location', gps(models.coorGPS))

// Server connection
const server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)

})