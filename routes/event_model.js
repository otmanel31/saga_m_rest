const mongoose = require('mongoose')

const Schema = mongoose.Schema/*({
    type_event: String, 
    textarea: String,
    img: {data: Buffer, contentType: String},
    created_at: {type: Date, default: Date.now},
    sender: String,
    postion_event: String
})*/
const eventSchema = new Schema({
    type_event: String, 
    textarea: String,
    img: {data: Buffer, contentType: String},
    created_at: {type: Date, default: Date.now},
    sender: String,
    postion_event: String
})
const Event = mongoose.model('Event', eventSchema)
module.exports = Event
