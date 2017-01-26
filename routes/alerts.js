//route /alerts
const express = require('express')
const app = express.Router()

module.exports = () => {
    app.get('/', (req, res) => {
        console.log(req.url)
        res.send("Connected to route alerts")

    })
    return app
}