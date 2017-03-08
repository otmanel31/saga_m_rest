/*
    This file script is intended to populate a default usable database
*/
const models = require('./models')

setup = function(callback) {

    // create a sample user
    let foo = new models.User({
        name: 'Bar',
        password: 'password',
        admin: false
    })

    console.log('/setup inside')

    // save the sample user
    foo.save(function(err, user) {
        if (err) {
            callback(err)
        } else {
            callback(null, { success: true }, user)
            
        }
    })
}

module.exports = setup