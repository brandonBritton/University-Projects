process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const {MockData} = require("../../server/utils/mockData");
const assert = require('chai').assert

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server General Public Endpoints", () => {
    describe("POST /api/generalpublic/checkvaccinationisvalid", () => {
        it("returns error message 'Please enter vaccination code'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkvaccinationisvalid')
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter vaccination code');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'Vaccination record does not exist'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkvaccinationisvalid')
                .send({"vaccinationCode": "thisisinvalid"})
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Vaccination record does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("returns valid vaccination record", (done) => {
            MockData.createMockVaccinationRecord(true).then((vaccinationRecords)=>
                {
                    let vaccinationRecord = vaccinationRecords[0];
                        chai.request(app)
                        .post('/api/generalpublic/checkvaccinationisvalid')
                        .send({"vaccinationCode": vaccinationRecord.vaccinationCode})
                        .then((res) => {
                            if (res.status === 500) throw new Error(res.body.message);
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'vaccinationType', vaccinationRecord.vaccinationType);
                            assert.propertyVal(res.body, 'vaccinationStatus', vaccinationRecord.vaccinationStatus);
                            if ((new Date(res.body.dateAdministered)).getTime() !== vaccinationRecord.dateAdministered.getTime()) assert.fail("dateAdministered should match");
                            assert.propertyVal(res.body, 'patientFirstName', vaccinationRecord.patient.firstName);
                            assert.propertyVal(res.body, 'patientLastName', vaccinationRecord.patient.lastName);
                            done();
                    }).catch((err) => {
                            done(err);
                        });
                }).catch((err) => {
                done(err);
            });
        });
    });
    describe("GET /api/generalpublic/currenthotspots", () => {
        it("returns array of hotspots", async () => {
            // create test cases
            let checkIns = await MockData.createMockCheckIns(true, 100);
            let i = 0;
            let positiveCases = [];
            for (let checkIn of checkIns){
                if (i % 10 === 0) {
                    positiveCases.push((await MockData.createMockPositiveCases(true, 1, checkIn.user))[0]);
                }
                i++;
            }
            let res = await chai.request(app)
                .get('/api/generalpublic/currenthotspots')
            if (res.status === 500) throw new Error(res.body.message);
            assert.propertyVal(res.body, 'success', true);
            assert.isArray(res.body.hotspots);
            for(let hotspot of res.body.hotspots){
                assert.property(hotspot, 'venueName');
                assert.property(hotspot, 'abn');
                assert.property(hotspot, 'city');
                assert.property(hotspot, 'state');
                assert.property(hotspot, 'postcode');
                assert.property(hotspot, 'addressLine1');
                assert.property(hotspot, 'date');
                //if (hotspot.dateMarked > testDate) assert.fail("Test date must be after dateMarked");
                //if (hotspot.dateMarked < moment(testDate).subtract(14, 'days').toDate()) assert.fail("Test date must be after dateMarked");
            }
        });
    });
    describe("POST /api/generalpublic/checkin", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkin')
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
        });
        it("it returns error message 'Business venue does not exist'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkin')
                .send({
                    venueCode: "thisisinvalid",
                    firstName: "Test",
                    lastName: "Subject",
                    email: "testemail@emailer.com",
                    phone: "0426787724"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Business venue does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("returns valid checkin", (done) => {
            MockData.createMockBusinesses(true).then((businesses)=>
            {
                let business = businesses[0];
                chai.request(app)
                    .post('/api/generalpublic/checkin')
                    .send({
                        venueCode: business.code,
                        firstName: "Test",
                        lastName: "Subject",
                        email:"testemail@emailer.com",
                        phone: "0426787724"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'venueCode', business.code);
                        assert.propertyVal(res.body, 'businessName', business.name);
                        assert.property(res.body, 'checkinDate');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("GET /api/generalpublic/vaccinationcentres", () => {
        it("returns an array of vaccine centres", (done) => {
            MockData.createMockVaccinationCentres(true, 50).then((vaccinationCentres)=>
            {
                chai.request(app)
                    .get('/api/generalpublic/vaccinationcentres')
                    .send()
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.lengthOf(res.body.vaccinationCentres, vaccinationCentres.length);
                        for(let vaccineCentre of res.body.vaccinationCentres){
                            assert.property(vaccineCentre, 'clinicName');
                            assert.property(vaccineCentre, 'phone');
                            assert.property(vaccineCentre, 'addressLine1');
                            //assert.property(vaccineCentre, 'addressLine2');
                            assert.property(vaccineCentre, 'suburb');
                            assert.property(vaccineCentre, 'city');
                            assert.property(vaccineCentre, 'state');
                            assert.property(vaccineCentre, 'postcode');
                        }
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("GET /api/generalpublic/homepagestats", () => {
        it("returns homepage stats object", async () => {
            let checkIns = await MockData.createMockCheckIns(true, 100);
            let i = 0;
            let positiveCases = [];
            for (let checkIn of checkIns){
                if (i % 10 === 0) {
                    positiveCases.push((await MockData.createMockPositiveCases(true, 1, checkIn.user))[0]);
                }
                i++;
            }
            let res = await chai.request(app)
                .get('/api/generalpublic/homepagestats')
                .send()
            if (res.status === 500) throw new Error(res.body.message);
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            });
        });
});