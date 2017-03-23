const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    sender_id: String,
    type_event: String, 
    textarea: String,
    img: {data: Buffer, contentType: String},
    created_at: {type: Date, default: Date.now},
    sender: String,
    position_event: {longitude: Number ,latitude: Number}
})

const typeEventSchema = new Schema({
    type: Array
})

const Event = mongoose.model('Event', eventSchema)
const TypeEvent = mongoose.model('TypeEvent', typeEventSchema)
module.exports = {Event: Event, TypeEvent: TypeEvent}
