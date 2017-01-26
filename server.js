const express = require('express')
const app = express()
const path = require('path')
const alerts = require('./routes/alerts')
app.use('/gps', alerts())

const server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)

})