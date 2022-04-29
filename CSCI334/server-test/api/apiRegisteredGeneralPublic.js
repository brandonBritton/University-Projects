process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const assert = require('chai').assert
const RegisteredGeneralPublic = require("../../server/models/RegisteredGeneralPublic");
const {MockData} = require("../../server/utils/mockData");

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Registered General Public Endpoints", () => {
    describe("POST /api/registeredgeneralpublic/checkin", () => {
        it("returns error message 'Please enter all fields'", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];
            const res = await chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', user.accessToken);
                if (res.status === 500) throw new Error(res.body.message);
                assert.equal(res.status, 400);
                assert.propertyVal(res.body, 'errCode', 400);
                assert.propertyVal(res.body, 'success', false);
                assert.propertyVal(res.body, 'message', 'Please enter all fields');
        });
        it("it returns error message 'Business venue does not exist'", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];
            const res = await chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', user.accessToken)
                .send({
                    venueCode: "thisisinvalid"
                });
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Business venue does not exist');
        });
        it("returns valid checkin", async () => {
            let businesses = await MockData.createMockBusinesses(true);
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let business = businesses[0];
            let user = users[0];
            return chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', user.accessToken)
                .send({
                    venueCode: business.code,
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'venueCode', business.code);
                    assert.propertyVal(res.body, 'businessName', business.name);
                    assert.property(res.body, 'checkinDate');
                });
            });
        });
    describe("GET /api/registeredgeneralpublic/profile", () => {
        it("returns user data", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', user.accessToken);
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, "userId", user.id);
            assert.propertyVal(res.body, "firstName", user.firstName);
            assert.propertyVal(res.body, "lastName", user.lastName);
            assert.propertyVal(res.body, "phone", user.phone);
        });
    });
    describe("POST /api/registeredgeneralpublic/profile", () => {
        it("returns error message 'Please enter all fields'", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];
            const res = await chai.request(app)
                .post('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', user.accessToken);

                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
        });
        it("updates user data", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', user.accessToken)
                .send({
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            let changedUser = await RegisteredGeneralPublic.findById(user.id);
            assert.propertyVal(changedUser, "id", user.id);
            assert.propertyVal(changedUser, "firstName", "Bob");
            assert.propertyVal(changedUser, "lastName", "Costas");
            assert.propertyVal(changedUser, "phone", "0405060607");
        });
    });
    describe("GET /api/registeredgeneralpublic/vaccinationstatus", () => {
        it("returns user vaccination status (0 records)", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/registeredgeneralpublic/vaccinationstatus')
                .set('x-auth-token', user.accessToken);
            assert.equal(res.status, 200);
            assert.equal(res.body.vaccinationRecords.length, 0);
        });
        it("returns user vaccination status (5 records)", async () => {
            let users = await MockData.createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];
            let vaccinationRecords = await MockData.createMockVaccinationRecord(true, 5, user);

            const res = await chai.request(app)
                .get('/api/registeredgeneralpublic/vaccinationstatus')
                .set('x-auth-token', user.accessToken);
            assert.equal(res.status, 200);
            assert.equal(res.body.vaccinationRecords.length, 5);
        });
    });
});
