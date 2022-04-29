const express = require('express')
const router = express.Router();
const RegisteredGeneralPublicUser = require('../../../models/RegisteredGeneralPublic')
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const Business = require("../../../models/Business");
const CheckIn = require("../../../models/CheckIn");
const VaccinationRecord = require("../../../models/VaccinationRecord");
const {ServerError} = require("../../../utils/errors");

/*
* @route   POST api/registeredgeneralpublic/checkin
* @desc    Performs a checkin for registered general public user
* @access  Private
*/

router.post('/checkin', authMiddleware(userType.GENERAL), asyncHandler(async (req, res) => {
    const { userId, venueCode } = req.body;

    // Simple validation
    if (!userId || !venueCode) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const business = await Business.findOne({ code: venueCode });
    if (!business) throw new BadRequest('Business venue does not exist');

    // Check for existing user
    const user = await RegisteredGeneralPublicUser.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    const checkin = new CheckIn({business: business, user: user, userModel: user.constructor.modelName})
    let savedCheckin = await checkin.save();
    if(!savedCheckin) throw new ServerError("Error saving checkin");

    res.status(200).json({
        success: true,
        venueCode,
        checkinDate: savedCheckin.date,
        businessName: business.name
    });
}));

/*
* @route   GET api/registeredgeneralpublic/profile
* @desc    Returns a registered general public users profile info
* @access  Private
*/

router.get('/profile', authMiddleware(userType.GENERAL), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await RegisteredGeneralPublicUser.findById(userId).select('-password');
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
    });
}));

/*
* @route   POST api/registeredgeneralpublic/profile
* @desc    Updates a registered general public users profile info
* @access  Private
*/

router.post('/profile', authMiddleware(userType.GENERAL), asyncHandler(async (req, res) => {
    const { userId,  firstName, lastName, phone } = req.body;

    // Simple validation
    if (!userId || !firstName || !lastName) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await RegisteredGeneralPublicUser.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    const newUser = await user.save();
    if (!newUser) throw new ServerError('Error updating user');

    res.status(200).json({
        success: true,
    });
}));

/*
* @route   GET api/registeredgeneralpublic/vaccinationstatus
* @desc    Returns a registered general public users vaccination info
* @access  Private
*/

router.get('/vaccinationstatus', authMiddleware(userType.GENERAL), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing vaccination records
    const vaccinationRecords = await VaccinationRecord.find({patient: userId}).sort({dateAdministered: -1});

    const vaccinationRecordsCompiled = [];

    vaccinationRecords.forEach(vaccinationRecord =>
        vaccinationRecordsCompiled.push(
            {
                vaccinationCode:vaccinationRecord.vaccinationCode,
                vaccinationType:vaccinationRecord.vaccinationType,
                vaccinationStatus:vaccinationRecord.vaccinationStatus,
                dateAdministered:vaccinationRecord.dateAdministered
            }
        )
    );

    res.status(200).json({
        success: true,
        vaccinationRecords: vaccinationRecordsCompiled
    });
}));

module.exports = router;