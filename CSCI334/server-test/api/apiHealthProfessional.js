process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const assert = require('chai').assert
const HealthProfessional = require("../../server/models/HealthProfessional");
const VaccinationRecord = require("../../server/models/VaccinationRecord");
const VaccinationCentre = require("../../server/models/VaccinationCentre");
const {MockData} = require("../../server/utils/mockData");

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Health Professional Endpoints", () => {
    describe("GET /api/healthprofessional/profile", () => {
        it("returns user data", async () => {
            let users = await MockData.createMockHealthProfessionalUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/healthprofessional/profile')
                .set('x-auth-token', user.accessToken);
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, "firstName", user.firstName);
            assert.propertyVal(res.body, "lastName", user.lastName);
            assert.propertyVal(res.body, "phone", user.phone);
            assert.propertyVal(res.body, "healthId", user.healthID);
        });
    });
    describe("POST /api/healthprofessional/profile", () => {
        it("returns error message 'Please enter all fields'", async () => {
            let users = await MockData.createMockHealthProfessionalUsers(true);
            let user = users[0];
            const res = await chai.request(app)
                .post('/api/healthprofessional/profile')
                .set('x-auth-token', user.accessToken);

                if (res.status === 500) throw new Error(res.body.message);
                assert.equal(res.status, 400);
                assert.propertyVal(res.body, 'errCode', 400);
                assert.propertyVal(res.body, 'success', false);
                assert.propertyVal(res.body, 'message', 'Please enter all fields');

        });
        it("updates user data", async () => {
            let users = await MockData.createMockHealthProfessionalUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/profile')
                .set('x-auth-token', user.accessToken)
                .send({
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            let changedUser = await HealthProfessional.findById(user.id);
            assert.propertyVal(changedUser, "id", user.id);
            assert.propertyVal(changedUser, "firstName", "Bob");
            assert.propertyVal(changedUser, "lastName", "Costas");
            assert.propertyVal(changedUser, "phone", "0405060607");
        });
    });
    describe("POST /api/healthprofessional/markpatientpositive", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/markpatientpositive')
                    .set('x-auth-token', user.accessToken)
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Please enter all fields');
                        done();
                    }).catch((err) => {
                    done(err);
                });
        }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'User does not exist'", (done) => {
                MockData.createMockHealthProfessionalUsers(true).then((users) => {
                    let user = users[0];
            chai.request(app)
                .post('/api/healthprofessional/markpatientpositive')
                .set('x-auth-token', user.accessToken)
                .send({
                    email:"Sienna_Hayes85@hotmail.com",
                    testDate:'2021-02-02',
                    infectiousStartDate:'2021-01-26',
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        }).catch((err) => {
                    done(err);
                });
        });
        it("marks user as positive case", async () => {
            let healthUsers = await MockData.createMockHealthProfessionalUsers(true);
            let healthUser = healthUsers[0];

            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/markpatientpositive')
                .set('x-auth-token', healthUser.accessToken)
                .send({
                    email: user.email,
                    testDate:'2021-02-02',
                    infectiousStartDate:'2021-01-26',
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
        });
    });
    describe("POST /api/healthprofessional/confirmpatientvaccinationinformation", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
            chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
                .set('x-auth-token', user.accessToken)
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                }).catch((err) => {
                done(err);
            });
            }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'Patient does not exist'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
            chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
                .set('x-auth-token', user.accessToken)
                .send({
                    email:"Nicholas.Ritchie79@hotmail.com",
                    vaccinationType:"Novavax",
                    dateAdministered:'02-02-2021',
                    status:'Complete'
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Patient does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
            }).catch((err) => {
                done(err);
            });
        });
        it("confirms user vaccination", async () => {
            let patients = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let patient = patients[0];
            let healthUsers = await MockData.createMockHealthProfessionalUsers(true);
            let healthUser = healthUsers[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
                .set('x-auth-token', healthUser.accessToken)
                .send({
                    email: patient.email,
                    vaccinationType: "Novavax",
                    dateAdministered: '02-02-2021',
                    status: "Complete"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            let savedVRecord = await VaccinationRecord.findOne({
                patient: patient,
                vaccinationType: "Novavax",
                dateAdministered: new Date('02-02-2021'),
                vaccinationStatus: "Complete"});
            assert.isNotNull(savedVRecord);
        });
    });
    describe("POST /api/healthprofessional/addvaccinationcentreinformation", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/addvaccinationcentreinformation')
                    .set('x-auth-token', user.accessToken)
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Please enter all fields');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("adds vaccination centre information", async () => {
            let healthUsers = await MockData.createMockHealthProfessionalUsers(true);
            let healthUser = healthUsers[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/addvaccinationcentreinformation')
                .set('x-auth-token', healthUser.accessToken)
                .send({
                    clinicName: "Wollongong Clinic",
                    addressLine1: "Wollongong Street",
                    addressLine2: "2nd Wollongong Street",
                    suburb: "Wollongong",
                    city: "Sydney",
                    state: "NSW",
                    postcode: "2000",
                    latitude: -32.6576,
                    longitude: -176.6316,
                    phone: "0412345678"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            let savedVCentre = await VaccinationCentre.findOne({
                clinicName: "Wollongong Clinic"});
            assert.isNotNull(savedVCentre);
        });
    });
});