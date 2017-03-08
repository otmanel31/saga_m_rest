//route /location
const express = require('express')
const app = express.Router()
var bodyParser = require('body-parser');
app.use(bodyParser.json());

module.exports = (users) => { 

    //######################################
    // GET  /users/          : get all users
    //######################################


    //---------------------------------------
    // Get all users in database (GET /saga/users)
    //---------------------------------------
    app.get('/', (req, res) => {
        users.find(null, function(err, allusers) {
            if (err) {
                throw err;
                res.status(404).end()
            } else {
                res.status(200)
                res.send(allusers).end()
            }
        })
    })

    return app
}
