process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const {MockData} = require("../../../server/utils/mockData");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const HealthProfessionalUser = require("../../../server/models/HealthProfessional");
const jwt = require('jsonwebtoken');
const config = require('config');
const sinon = require("sinon");
const JWT_SECRET = config.get('JWT_SECRET');

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API Health Professional Auth", () => {
    describe("POST /api/healthprofessional/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
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
        it("it returns message 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
                .send({"email": "test@test.com", "password": "pass"})
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
        });
        it("it allows successful login", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("it allows successful temporary login", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then(async (users) => {
                let user = users[0];
                let tempPassword = user.setTemporaryPassword();
                const savedUser = await user.save();
                chai.request(app)
                    .post('/api/healthprofessional/auth/login')
                    .send({"email": savedUser.email, "password": tempPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        HealthProfessionalUser.findById(savedUser.id).then((uUser) => {
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                            assert.propertyVal(res.body, 'isTemporary', true);
                            assert.propertyVal(uUser.passwordReset, 'expiry', undefined);
                            assert.propertyVal(uUser.passwordReset, 'temporaryPassword', undefined);
                            assert.property(res.body, 'token');
                            let decoded = jwt.verify(res.body.token, JWT_SECRET);
                            assert.propertyVal(decoded, 'userId', user.id);
                            assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
                            done();
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/healthprofessional/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/register')
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
        it("Registers new health professional user", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/register')
                .send({
                    "email": "test2@email.com",
                    "password": "testPassword2",
                    "firstName": "Johnny",
                    "lastName": "Smithy",
                    "phone": "0476898725",
                    "healthID": "56565656565"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                    HealthProfessionalUser.findOne({email: "test2@email.com"}).select("+password").then((user) => {
                        assert.property(res.body, 'token');
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
                        assert.propertyVal(user, 'firstName', "Johnny");
                        assert.propertyVal(user, 'lastName', "Smithy");
                        assert.propertyVal(user, 'phone', "0476898725");
                        assert.propertyVal(user, 'healthID', "56565656565");
                        assert.isTrue(user.comparePassword("testPassword2"));
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/healthprofessional/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
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
        it("returns error message 'Password and confirm password do not match'", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .set('x-auth-token', user.accessToken)
                    .send({
                        "newPassword": "newPassword",
                        "confirmPassword": "newPasswordDifferent",
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("It changes a HealthProfessionalUsers password", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .set('x-auth-token', user.accessToken)
                    .send({
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        HealthProfessionalUser.findById(user.id).select("+password").then((changedUser) => {
                            bcrypt.compare("newPassword", changedUser.password).then((v) => {
                                assert.isTrue(v);
                                done();
                            }).catch((err) => {
                                done(err);
                            });
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/healthprofessional/auth/forgotpassword", () => {
        let mySpy;
        beforeEach(function() {
            mySpy = sinon.spy(HealthProfessionalUser.prototype, "setTemporaryPassword");
        });
        afterEach(function() {
            mySpy.restore();
        });
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/forgotpassword')
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
        it("It creates a password reset request", (done) => {
            MockData.createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                // reset the history so that you get the correct call
                global.setApiKeyStub.resetHistory();
                global.sendMailStub.resetHistory();
                chai.request(app)
                    .post('/api/healthprofessional/auth/forgotpassword')
                    .send({email: user.email})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.isTrue(global.setApiKeyStub.called);
                        assert.isTrue(global.sendMailStub.called);
                        HealthProfessionalUser.findById(user.id).then((changedUser) => {
                            assert.notEqual(global.sendMailStub.getCall(0).args[0]["html"].indexOf(mySpy.getCall(0).returnValue), -1);
                            assert.property(changedUser.passwordReset, 'temporaryPassword');
                            assert.property(changedUser.passwordReset, 'expiry');
                            assert.isTrue(changedUser.compareTemporaryPassword(mySpy.getCall(0).returnValue));
                            done();
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    })
});