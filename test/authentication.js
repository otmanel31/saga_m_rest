//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let User = require('../models').User

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let setup = require('../setup_dev')
let should = chai.should()

chai.use(chaiHttp)

//Our parent block
describe('User', () => {

    before((done) => {
        //Before each test we empty the database
        User.remove({}, (err) => {
            done()
        })

        // initialize database with dummy datas
        setup((err, msg) => {
            if (err)
                console.log('Authentication Test Error : ' + err)
        })
    })

    /*
     * Test the /POST authenticate
     */
    describe('/POST authenticate', () => {
        it('it should send user token', (done) => {

            let payload = {
                name: 'Bar',
                password: 'password'
            }

            chai.request(server)
                .post('/authenticate')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.be.eql(true);
                    res.body.should.have.property('token');
                    done()
                })
        })
    })
})