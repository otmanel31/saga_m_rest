const fs2 = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const inspect = require('util').inspect
const bodyParser = require('body-parser')
const Event = require('./event_model')
const formidable = require('formidable')
const fs = require('fs-extra')

app.use(bodyParser.json())

module.exports = (db) => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/event.html'))
    })
    app.post('/', (req, res) => {
        console.log('passage in the events')
        console.log(inspect(req.body))
        console.log('received ' + JSON.stringify(req.body))
        let event = new Event()
        let form = new formidable.IncomingForm()
        form.parse(req, function(err, fields, files) {
                console.log('data received\n\n')
                console.log(inspect({ fields: fields, files: files }))
                console.log('fields type ',inspect(fields.type))
                event.type_event = fields.type
                event.textarea = fields.text_event 
           console.log('in files log ',files.file.name) 
            })
            /*0  event.type_event = req.body.type
              event.textarea =  req.body.text_event*/

        form.on('end', function(fields, files) {
            var temp_path = this.openedFiles[0].path
            var filename = this.openedFiles[0].path
            var new_location = path.join(__dirname, '/upload')
            fs.copy(temp_path, new_location + filename, function(err) {
                if (err) console.log(err)
                console.log('copy succes')
                event.img.data = fs2.readFileSync(new_location + filename)
                event.save(function(err, events) {
                    console.log('in save')
                    console.log(events)
                    console.log('with inspect in save', inspect(events))
                })
            })
            console.log(new_location+filename)
            console.log(new_location)
            console.log(filename)
            var file = filename.split('/')
            console.log('file name',file)
        })
           // fs.unlink(new_location+'/tmp/'+file[2])
    })
    app.get('/list', (req, res) => {
        res.send('listes')
    })
    app.get('/:id', (req, res) => {
        event = new Event()
        console.log(req.params.id)
        Event.findById(req.params.id, function(err, doc) {
            if (err) return console.error(err)
                //res.contentType(doc.img.contentType)
                //let i = new Buffer(doc.img.data, 'binary')
            res.send(doc.img.data)
        })
    })
    return app
}
