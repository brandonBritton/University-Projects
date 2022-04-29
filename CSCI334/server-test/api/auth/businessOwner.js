process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const {MockData} = require("../../../server/utils/mockData");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const BusinessUser = require("../../../server/models/BusinessUser");
const jwt = require('jsonwebtoken');
const config = require('config');
const sinon = require("sinon");
const JWT_SECRET = config.get('JWT_SECRET');

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API BusinessOwner Auth", () => {
    describe("POST /api/businessowner/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/login')
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
        it("it returns msg 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/login')
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
            MockData.createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'type', USER_TYPE.BUSINESS);
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.BUSINESS);
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("it allows successful temporary login", (done) => {
            MockData.createMockBusinessUsers(true).then(async (users) => {
                let user = users[0];
                let tempPassword = user.setTemporaryPassword();
                const savedUser = await user.save();
                chai.request(app)
                    .post('/api/businessowner/auth/login')
                    .send({"email": savedUser.email, "password": tempPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        BusinessUser.findById(savedUser.id).then((uUser) => {
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'type', USER_TYPE.BUSINESS);
                            assert.propertyVal(res.body, 'isTemporary', true);
                            assert.propertyVal(uUser.passwordReset, 'expiry', undefined);
                            assert.propertyVal(uUser.passwordReset, 'temporaryPassword', undefined);
                            assert.property(res.body, 'token');
                            let decoded = jwt.verify(res.body.token, JWT_SECRET);
                            assert.propertyVal(decoded, 'userId', user.id);
                            assert.propertyVal(decoded, 'userType', USER_TYPE.BUSINESS);
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
    describe("POST /api/businessowner/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/register')
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
        it("Register new business", (done) => {
            let userData = {
                firstName: "Billy",
                lastName: "Jones",
                email: "billy.jones@gmail.com",
                password: "thisismypassword",
                phone: "0567899934",
                abn: "15678956743",
                businessName: "My Business",
                addressLine1: "Unit 1",
                addressLine2: "155 Musselbrook ave",
                suburb: "Smithville",
                city: "Sydney",
                state: "NSW",
                postcode: "2010"
            };
            chai.request(app)
                .post('/api/businessowner/auth/register')
                .send(userData)
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.BUSINESS);
                    BusinessUser.findOne({email: userData.email}).select("+password").then((user) => {
                        assert.propertyVal(user, 'firstName', userData.firstName);
                        assert.propertyVal(user, 'lastName', userData.lastName);
                        assert.propertyVal(user, 'phone', userData.phone);
                        assert.propertyVal(user.business, 'abn', userData.abn);
                        assert.propertyVal(user.business, 'name', userData.businessName);
                        assert.propertyVal(user.business.address, 'addressLine1', userData.addressLine1);
                        assert.propertyVal(user.business.address, 'addressLine2', userData.addressLine2);
                        assert.propertyVal(user.business.address, 'suburb', userData.suburb);
                        assert.propertyVal(user.business.address, 'city', userData.city);
                        assert.propertyVal(user.business.address, 'state', userData.state);
                        assert.propertyVal(user.business.address, 'postcode', userData.postcode);
                        assert.isTrue(user.comparePassword(userData.password));
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.BUSINESS);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                }).catch((err) => {
                    done(err);
                });
        });
    });
    describe("POST /api/businessowner/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/changepassword')
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
            MockData.createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/changepassword')
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
        it("It changes a BusinessUsers password", (done) => {
            MockData.createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/changepassword')
                    .set('x-auth-token', user.accessToken)
                    .send({
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        BusinessUser.findById(user.id).select("+password").then((changedUser) => {
                            bcrypt.compare("newPassword", changedUser.password).then((v) => {
                                assert.isTrue(v);
                                done();
                            });
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            });
        });
    });
    describe("POST /api/businessowner/auth/forgotpassword", () => {
        let mySpy;
        beforeEach(function() {
            mySpy = sinon.spy(BusinessUser.prototype, "setTemporaryPassword");
        });
        afterEach(function() {
            mySpy.restore();
        });
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/forgotpassword')
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
            MockData.createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                // reset the history so that you get the correct call
                global.setApiKeyStub.resetHistory();
                global.sendMailStub.resetHistory();
                chai.request(app)
                    .post('/api/businessowner/auth/forgotpassword')
                    .send({email: user.email})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.isTrue(global.setApiKeyStub.called);
                        assert.isTrue(global.sendMailStub.called);
                        BusinessUser.findById(user.id).then((changedUser) => {
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