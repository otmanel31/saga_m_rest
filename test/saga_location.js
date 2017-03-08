//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let coorGPS = require('../models').coorGPS
let User = require('../models').User

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let setup = require('../setup_dev')
let should = chai.should()


chai.use(chaiHttp)
chai.use(require('chai-datetime'));

//Our parent block
describe('SAGA location route testing', () => {
    var token = ''

    before((done) => {

        setup((err, msg) => {
            if (err)
                console.log('Authentication Test Error : ' + err)
        })

        //Before test we get a authenticate token
        let payload = {
            name: 'Bar',
            password: 'password'
        }

        //receive a token authenticate
        chai.request(server)
            .post('/authenticate')
            .send(payload)
            .end((err, res) => {
                var result = JSON.parse(res.text);
                token = result.token;
                done()
            })

        //force uid_user
        var uid_user1 = 123
        var uid_user2 = 345

        //Fill database with 10 coordinates GPS for first user and 10 for second user
        //firs user
        for (var num_user = 0; num_user < 2; num_user++) {
            let uid_user
            num_user == 0 ? uid_user = uid_user1 : uid_user = uid_user2 //select user uid
            for (var i = 0; i < 10; i++) {
                example_coorGPS = new coorGPS({
                    uuid_user: uid_user,
                    timestamp: 1340900279 + i,
                    lattitude: 48.862725 + i,
                    longitude: 2.287592 + i,
                    altitude: 1200 + i,
                    altitudeAccuracy: 0 + i,
                    heading: 45 + i,
                    speed: 100 + i,
                })
                example_coorGPS.save()
            }
        }
    })

    after((done) => {
        User.remove({}, (err) => {
            if (err) {
                console.log(err)
            }
            done()
        })
    })

    /*
     * Test the /GET route
     */
    describe('/GET saga/location', () => {
        it('it should send all location', (done) => {
            chai.request(server)
                .get('/saga/location')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.equal(20)
                    res.body.forEach((gpsObject) => {
                        gpsObject.should.have.property('uuid_user')
                        gpsObject.should.have.property('timestamp')
                        gpsObject.should.have.property('lattitude')
                        gpsObject.should.have.property('longitude')
                    })
                    done()
                })
        })
    })

    describe('/GET saga/location/:uid_user', () => {
        it('it should only send location of uid_user', (done) => {
            let uid_user1 = 123
            chai.request(server)
                .get('/saga/location/' + uid_user1)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.length.should.be.equal(10)
                    res.body.forEach((gpsObject) => {
                        gpsObject.should.have.property('uuid_user', uid_user1)
                    })
                    done()
                })

        })
    })

})