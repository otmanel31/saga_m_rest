const express = require('express')
const app = express()
const path = require('path')
const alerts = require('./routes/alerts')
const events = require('./routes/events')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/saga')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.on('open', function(){
    console.log('connected on mongoDb')
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use('/alerts', alerts())
app.use('/events', events(db))


const server = app.listen(3000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)

})
