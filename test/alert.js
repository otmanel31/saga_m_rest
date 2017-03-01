'use strict'
//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let Alert = require('../models').Alert

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let setup = require('../setup_dev')
let should = chai.should()


chai.use(chaiHttp)

//Our parent block
describe('Alert Route testing', () => {
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


    afterEach((done) => {
        //Before each test we empty the database
        Alert.remove({}, (err) => {
            if (err) {
                console.log(err)
            }
            done()
        })
    })

    /*
     * Test the /GET route
     */
    describe('/GET alert by uid_user', () => {

        it('it should return alert of uid_user', (done) => {
            let uid_user = 123

            // Store alert in database
            let AlertExample = new Alert({
                uuid_user: uid_user,
                title: "Alert Title",
                body: "Body of title",
                ack: "false"
            })

            AlertExample.save(function(err, data) {
                if (err) console.log(err)
            })

            // send GET request
            chai.request(server)
                .get('/alerts/' + uid_user)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('Array')
                    res.body[0].uuid_user.should.be.equal(AlertExample.uuid_user)
                    res.body[0].title.should.be.equal(AlertExample.title)
                    res.body[0].body.should.be.equal(AlertExample.body)
                    res.body[0].ack.should.be.equal(AlertExample.ack)
                    done()
                });
        })

        it('it should update true acknowledge', (done) => {
            let uid_user = 123

            // Store alert in database
            let AlertExample = new Alert({
                uuid_user: uid_user,
                title: "Alert Title",
                body: "Body of title",
                ack: "false"
            })

            AlertExample.save(function(err, data) {
                if (err) console.log(err)
                    //get alert id created
                var uid_alert = data._id

                // send PATCH request
                chai.request(server)
                    .patch('/alerts/ack/' + uid_alert)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        // verify acknowledge is true
                        Alert.findById(uid_alert, function(err, alert) {
                            alert.ack.should.be.equal(true)
                            done()

                        })

                    });
            })


        })
    })
})