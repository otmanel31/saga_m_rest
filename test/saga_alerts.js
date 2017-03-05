'use strict'
//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let Alert = require('../models').Alert
let User = require('../models').User

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let setup = require('../setup_dev')
let should = chai.should()


chai.use(chaiHttp)

//Our parent block
describe('SAGA Alert Route testing', () => {
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


        //fill alert database
        var uid_user1 = 111111111111111111
        var uid_user2 = 222222222222222222
        for (var num_user = 0; num_user < 2; num_user++) {
            let uid_user
            num_user == 0 ? uid_user = uid_user1 : uid_user = uid_user2 //select user uid
            for (var i = 0; i < 5; i++) {
                var example_alert = new Alert({
                    uuid_user: uid_user,
                    title: "New alert " + i,
                    body: "Body of alert number " + i,
                    ack: false
                })
                example_alert.save()
            }
        }
    })

    beforeEach((done) => {
        //remove alerts collection
        Alert.remove()
        done()
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
    describe('/POST alert by uid_user', () => {

        it('it should not store alert in database if user does not exist', (done) => {
            let uid_user = 456 // uid user must not exist

            // send POST request
            chai.request(server)
                .post('/saga/alerts/' + uid_user)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(404)
                    Alert.findById(uid_user, (err, res) => {
                        err.should.not.equal(null)
                        done()
                    })

                });
        })
    })


    /*
     * Test the /GET route
     */
    describe('/GET all alert', () => {

        it('it send all alert from database', (done) => {
            let uid_user = 111111111111111111 // uid user must not exist

            // send GET request
            chai.request(server)
                .get('/saga/alerts/')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.length(10)
                    done()
                });
        })
    })
})