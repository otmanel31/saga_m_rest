const mongoose = require('mongoose');
const Schema = mongoose.Schema

// coorGPS database schema
const coorGPS = mongoose.model('CoordGPS', new Schema({
    uuid_user: Number,
    timestamp: Date,
    lattitude: Number,
    longitude: Number,
    altitude: Number,
    altitudeAccuracy: Number,
    heading: Number,
    speed: Number,
}))

// set up a mongoose model and pass it using module.exports
const userSchema = mongoose.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}))


// alertModel database schema
const alertModel = mongoose.model('alert', new Schema({
    uuid_user: Number,
    title: String,
    body: String
}))


module.exports = {
    coorGPS: coorGPS,
    User: userSchema,
    Alert: alertModel
}