process.env.NODE_ENV = 'testing';
const RegisteredGeneralPublic = require('../../server/models/RegisteredGeneralPublic');
const assert = require('chai').assert

describe('RegisteredGeneralPublic', () => {
    describe('Add user', () => {
        it('it should add a Registered General Public User', (done) => {
            let user = new RegisteredGeneralPublic({
                email: "bill@billy.com",
                password: "fdfdfddf",
                firstName: "Bill",
                lastName: "Jones"
            });
            user.save().then((savedUser)=> {
                RegisteredGeneralPublic.findById(user._id, "+password", {}).then((rUser)=>{
                    assert.isObject(rUser);
                    assert.equal(rUser.firstName,"Bill");
                    assert.equal(rUser.lastName,"Jones");
                    assert.isTrue(rUser.comparePassword("fdfdfddf"));
                    assert.equal(rUser.email,"bill@billy.com");
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        });
    });
    describe('Edit user', () => {
        it('it should edit a Registered General Public User', (done) => {
            RegisteredGeneralPublic.findOne({}).then((user) => {
                user.firstName = "John";
                user.lastName = "Smith";
                user.email = "different@email.com";
                user.password = "password";
                user.save().then(()=> {
                    RegisteredGeneralPublic.findById(user._id, "+password", {}).then((rUser)=>{
                        assert.isObject(rUser);
                        assert.equal(rUser.firstName,"John");
                        assert.equal(rUser.lastName,"Smith");
                        assert.isTrue(rUser.comparePassword("password"));
                        assert.equal(rUser.email,"different@email.com");
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
