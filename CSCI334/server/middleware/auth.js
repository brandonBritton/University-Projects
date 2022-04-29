const USER_TYPE = require("../_constants/usertypes");
const RegisteredGeneralPublic = require("../models/RegisteredGeneralPublic");
const HealthProfessional = require("../models/HealthProfessional");
const BusinessUser = require("../models/BusinessUser");

const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require("mongoose");
const {Unauthorized} = require("../utils/errors");
const JWT_SECRET = config.get('JWT_SECRET');
const asyncHandler = require('express-async-handler');

module.exports = (usertype) => {
    return asyncHandler(async (req, res, next) => {
        const token = req.header('x-auth-token');
        // Check for token
        if (!token)
            throw new Unauthorized('No token, authorization denied');
        let decoded;
        try {
            // Verify token
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            throw new Unauthorized('Invalid token, authorization denied');
        }
        if (decoded.userType !== usertype) throw new Unauthorized('Invalid usertype for token');
        if (!mongoose.Types.ObjectId.isValid(decoded.userId)) throw new Unauthorized('UserId is invalid');

        let user;
        if(usertype === USER_TYPE.GENERAL){
            user = await RegisteredGeneralPublic.findById(decoded.userId);
        } else if(usertype === USER_TYPE.HEALTH) {
            user = await HealthProfessional.findById(decoded.userId);
        } else if(usertype === USER_TYPE.BUSINESS) {
            user = await BusinessUser.findById(decoded.userId);
        } else {
            throw new Unauthorized('Invalid usertype for token');
        }
        if (!user) throw new Unauthorized('User does not exist');
        if (!user.accessToken || user.accessToken !== token) throw new Unauthorized('Token invalid or has expired');

        Object.assign(req.body, decoded);
        next();
    });
}
