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
describe('location route testing', () => {
    var token = ''

    before((done) => {

        setup((err, msg) => {
            if (err)
                console.log('Authentication Test Error : ' + err)
        })

        //Before each test we get a authenticate token
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
    })


    beforeEach(() => {
        //Before each test we empty the database
        coorGPS.remove({}, (err) => {})
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
     * Test the /POST route
     */
    describe('/POST location', () => {

        it('it should store coordinate in database', (done) => {

            // load payload
            let payload = {
                Timestamp: 1340900279,
                Lattitude: 48.862725,
                Longitude: 2.287592,
                Altitude: 1200,
                AltitudeAccuracy: 0,
                Heading: 45,
                Speed: 100,
            }

            let uid_user = 123

            // send POST request
            chai.request(server)
                .post('/location/' + uid_user)
                .set('Authorization', 'Bearer ' + token)
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(201);
                    coorGPS.findOne({ uuid_user: uid_user }, function(err, coorGPSFromDb) {
                        let ConvertTimestamp = new Date(payload.Timestamp * 1000);
                        (coorGPSFromDb.timestamp).should.equalTime(ConvertTimestamp);
                        (coorGPSFromDb.lattitude).should.equal(payload.Lattitude);
                        (coorGPSFromDb.longitude).should.equal(payload.Longitude);
                        (coorGPSFromDb.altitude).should.equal(payload.Altitude);
                        (coorGPSFromDb.altitudeAccuracy).should.equal(payload.AltitudeAccuracy);
                        (coorGPSFromDb.heading).should.equal(payload.Heading);
                        (coorGPSFromDb.speed).should.equal(payload.Speed);

                        done()
                    });
                })
        })

        it('it should send Location header with a link to the id resource', (done) => {

            // load payload
            let payload = {
                Timestamp: 1340900279,
                Lattitude: 48.862725,
                Longitude: 2.287592,
                Altitude: 1200,
                AltitudeAccuracy: 0,
                Heading: 45,
                Speed: 100,
            }

            let uid_user = 123

            // send POST request
            chai.request(server)
                .post('/location/' + uid_user)
                .set('Authorization', 'Bearer ' + token)
                .send(payload)
                .end((err, res) => {
                    res.should.have.header('Location', '/location/' + uid_user)
                    done()
                });
        })

        it('it should returning an error if Timestamp, Lattitude, Longitude is not defined and not store in database', (done) => {

            // load payload
            let payload = {
                Timestamp: null,
                Lattitude: null,
                Longitude: null,
                Altitude: 1200,
                AltitudeAccuracy: 0,
                Heading: 45,
                Speed: 100,
            }

            let uid_user = 456

            // send POST request
            chai.request(server)
                .post('/location/' + uid_user)
                .set('Authorization', 'Bearer ' + token)
                .send(payload)
                .end((err, res) => {

                    coorGPS.findOne({ uuid_user: uid_user }, function(err, coorGPSFromDb) {
                        should.not.exist(coorGPSFromDb)
                        done();
                    })
                });
        })
    })
})