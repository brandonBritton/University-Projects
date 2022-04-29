process.env.NODE_ENV = 'testing';
const mongoose = require("mongoose")
const db = require("../server/db");
const sinon = require("sinon");
const sgMail = require('@sendgrid/mail');

module.exports = {
    mochaGlobalSetup: async () => {
        await db.connect();
        // need to make global otherwise when applied multiple times for each test it does not work as expected
        global.setApiKeyStub = sinon.stub(sgMail, "setApiKey");
        global.sendMailStub = sinon.stub(sgMail, "send").callsFake(function fakeFn() {
            return [{statusCode: 202}];
        });
    },
    mochaGlobalTeardown: async () => {
        await mongoose.connection.db.dropDatabase();
    }
};
