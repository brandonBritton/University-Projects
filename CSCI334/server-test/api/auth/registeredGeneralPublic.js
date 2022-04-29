process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const RegisteredGeneralPublic = require("../../../server/models/RegisteredGeneralPublic");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const {MockData} = require('../../../server/utils/mockData');
const jwt = require('jsonwebtoken');
const config = require('config');
const sinon = require("sinon");
const JWT_SECRET = config.get('JWT_SECRET');

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API Registered General Public Auth", () => {
    describe("POST /api/registeredgeneralpublic/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/login')
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
                .post('/api/registeredgeneralpublic/auth/login')
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
            MockData.createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.propertyVal(res.body, 'isTemporary', false);
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.GENERAL);
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("it allows successful temporary login", (done) => {
            MockData.createMockRegisteredGeneralPublicUsers(true).then(async (users) => {
                let user = users[0];
                let tempPassword = user.setTemporaryPassword();
                const savedUser = await user.save();
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .send({"email": savedUser.email, "password": tempPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        RegisteredGeneralPublic.findById(savedUser.id).then((uUser) => {
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                            assert.propertyVal(res.body, 'isTemporary', true);
                            assert.propertyVal(uUser.passwordReset, 'expiry', undefined);
                            assert.propertyVal(uUser.passwordReset, 'temporaryPassword', undefined);
                            assert.property(res.body, 'token');
                            let decoded = jwt.verify(res.body.token, JWT_SECRET);
                            assert.propertyVal(decoded, 'userId', user.id);
                            assert.propertyVal(decoded, 'userType', USER_TYPE.GENERAL);
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
    describe("POST /api/registeredgeneralpublic/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
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
        it("Register new general public user", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
                .send({
                    "email": "test2@email.com",
                    "password": "testPassword2",
                    "firstName": "Johnny",
                    "lastName": "Smithy",
                    "phone": "0478987653",
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                    RegisteredGeneralPublic.findOne({email: "test2@email.com"}).select("+password").then((user) => {
                        assert.propertyVal(user, 'firstName', "Johnny");
                        assert.propertyVal(user, 'lastName', "Smithy");
                        assert.propertyVal(user, 'phone', "0478987653");
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.GENERAL);
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
    describe("POST /api/registeredgeneralpublic/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            MockData.createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/changepassword')
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
            MockData.createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/changepassword')
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
        it("It changes a RegisteredGeneralPublicUsers password",  (done) => {
            MockData.createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/changepassword')
                    .set('x-auth-token', user.accessToken)
                    .send({
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        RegisteredGeneralPublic.findById(user.id).select("+password").then((changedUser) => {
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
            });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/forgotpassword", () => {
        let mySpy;
        beforeEach(function() {
            mySpy = sinon.spy(RegisteredGeneralPublic.prototype, "setTemporaryPassword");
        });
        afterEach(function() {
            mySpy.restore();
        });
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/forgotpassword')
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
            MockData.createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                // reset the history so that you get the correct call
                global.setApiKeyStub.resetHistory();
                global.sendMailStub.resetHistory();
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/forgotpassword')
                    .send({email: user.email})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.isTrue(global.setApiKeyStub.called);
                        assert.isTrue(global.sendMailStub.called);
                        RegisteredGeneralPublic.findById(user.id).then((changedUser) => {
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
            });
        });
    });
});