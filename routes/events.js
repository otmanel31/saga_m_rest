const fs2 = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const inspect = require('util').inspect
const bodyParser = require('body-parser')
const formidable = require('formidable')
const fs = require('fs-extra')
//const responseTime = require('response-time')

const Event = require('./event_model').Event
const TypeEvent = require('./event_model').TypeEvent

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
    /*res.on('header', function(){
        let duration = Date.now() - req.date
        res.setHeader('X-Response-Time', duration)
    })*/
module.exports = (db) => {
  /*  app.use(responseTime())
    app.use((req, res, next)=>{
        req.date = Date.now()
        next()
    })*/
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/event.html'))
    })
    app.post('/', (req, res) => {
        console.log('passage in the events')

        let event = new Event()
        let form = new formidable.IncomingForm()
        form.parse(req, function(err, fields, files) {
                console.log('data received\n\n')
                console.log(inspect({ fields: fields, files: files} ))
                console.log('fields type ',inspect(fields.type))
                event.type_event = fields.type
                event.textarea = fields.text_event
                event.position_event.longitude = fields.longitude
                event.position_event.latitude = fields.latitude
           console.log('in files log ',files.file.name) 
            })

        form.on('end', function(fields, files) {
            var temp_path = this.openedFiles[0].path
            var filename = this.openedFiles[0].path
            var new_location = path.join(__dirname, '/upload')
        console.log('temp path',temp_path)
            //fs.copy(temp_path, new_location + filename, function(err) {
             //   if (err) console.log(err)
               // console.log('copy succes')
                //event.img.data = fs2.readFileSync(new_location + filename)
                event.img.data = fs2.readFileSync(temp_path)
                event.save(function(err, events) {
                    if (err){
                        res.status(500).end()
                    }
                        console.log('in save')
                        console.log(events)
                        console.log('with inspect in save', inspect(events))
                        res.status(200).end()
 
                    
                })
           // })
            console.log(new_location+filename)
            console.log(new_location)
            console.log(filename)
            var file = filename.split('/')
            console.log('file name',file)
        })
          // fs2.unlink(new_location+'/tmp/'+file[2])
    })
    app.get('/list', (req, res) => {
        let user = {}
        Event.find(function(err, event){
            if (err) return console.error(err)
            //console.log(event)
            event.forEach(function(ev){
                user[ev._id]=ev
            })
        console.log('in my user ',user)
        console.log('chiiiwaaawaaaa')
        res.send(user)
     //   res.json(event)
        })
    })

    app.get('/type_event', (req, res)=>{
        TypeEvent.find(function(err, type){
            if (err) return console.error(err)
            res.json(type)
        })
    })
    app.get('/:id', (req, res) => {
        event = new Event()
        console.log(req.params.id)
        Event.findById(req.params.id, function(err, doc) {
            if (err) return console.error(err)
                //res.contentType(doc.img.contentType)
                //let i = new Buffer(doc.img.data, 'binary')
            console.log(doc.img.data)
            res.send(doc.img.data)
        })
    })
    
/*
    app.put('/set_type', (req, res)=>{
        let file = fs2.readFileSync(__dirname + '/type_events.json', 'utf8')
        console.log(inspect(file))
        let fileP  = JSON.parse(file)
        console.log(fileP)
        //res.send(fileP.type)
        var type_now;
        TypeEvent.find(function(err, type){
            if (err) return console.error(err)
            
            type.map((elt)=>{
                console.log(elt._id)
                type_now = elt._id
                return type_now
            })
           // console.log('t  ', type_now)
            
            TypeEvent.findByIdAndUpdate(type_now,{type: fileP.type}, function(err, t){
                if (err) console.error(err)
                res.status(200).end()
            })
        })
        
    })*/
    return app
}
