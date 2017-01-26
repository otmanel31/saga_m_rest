//route /gps
const express = require('express')
const app = express.Router()

module.exports = () => {
    // read gps position for uuid users
    app.get('/:uuid', (req, res) => {
        console.log(req.url)

    })
    return app

    // write gps position for uuid users
    app.post('/:uuid', (req, res) => {
        console.log(req.url)

    })
    return app
}