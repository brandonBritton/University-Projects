const moment = require("moment");

const express = require('express')
const router = express.Router();
const HealthProfessional = require('../../../models/HealthProfessional');
const RegisteredGeneralPublic = require('../../../models/RegisteredGeneralPublic');
const VaccinationCentre = require('../../../models/VaccinationCentre');
const VaccinationRecord = require('../../../models/VaccinationRecord');
const PositiveCase = require('../../../models/PositiveCase');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const {ServerError} = require("../../../utils/errors");

const Address = require('../../../models/Address');
const Coordinates = require('../../../models/Coordinates');

/*
* @route   GET api/healthprofessional/profile
* @desc    Returns a registered general public users profile info
* @access  Private
*/

router.get('/profile', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await HealthProfessional.findById(userId).select('-password');
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        healthId: user.healthID
    });
}));

/*
* @route   POST api/healthprofessional/profile
* @desc    Updates a registered general public users profile info
* @access  Private
*/

router.post('/profile', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { userId,  firstName, lastName, phone } = req.body;

    // Simple validation
    if (!userId || !firstName || !lastName) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await HealthProfessional.findById(userId);
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

/**
* @route   POST api/healthprofessional/markpatientpositive
* @desc    Marks a user as positive for the virus
* @access  Private
*/

router.post('/markpatientpositive', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { email, testDate, infectiousStartDate } = req.body;

    // Simple validation
    if (!email || !testDate || !infectiousStartDate) {
        throw new BadRequest('Please enter all fields');
    }
    if(moment(infectiousStartDate).isSameOrAfter(moment(testDate))) throw new BadRequest('Test date must be later than infectious start date')

    // Check for existing user
    const user = await RegisteredGeneralPublic.findOne( { email: email } );
    if (!user) throw new BadRequest('User does not exist');

    // Marks user as positive case
    const positiveCase = new PositiveCase({ testDate: testDate, user: user, userModel: "RegisteredGeneralPublic", infectiousStartDate: infectiousStartDate });
    await positiveCase.save();

    res.status(200).json({
        success: true
    });
}));

/**
 * @route   POST api/healthprofessional/confirmpatientvaccinationinformation
 * @desc    confirms patient vaccination information
 * @access  Private
 */
//npm run server-test -- --grep "/api/healthprofessional/addvaccinationcentreinformation"
router.post('/confirmpatientvaccinationinformation', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { email, vaccinationType, dateAdministered, status } = req.body;

    // Simple validation
    if (!email || !vaccinationType || !dateAdministered || !status) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing patient
    const user = await RegisteredGeneralPublic.findOne( { email: email } );
    if (!user) throw new BadRequest('Patient does not exist');

    const vaccinationRecord = new VaccinationRecord({
        vaccinationType,
        vaccinationStatus: status,
        dateAdministered,
        patient: user
    });

    const savedVaccinationRecord = await vaccinationRecord.save();
    if(!savedVaccinationRecord) throw new BadRequest('Error saving vaccination record');

    res.status(200).json({
        success: true
    });
}));

/**
 * @route   POST api/healthprofessional/addvaccinationcentreinformation
 * @desc    adds vaccination centre information
 * @access  Private
 */
//npm run server-test -- --grep "/api/healthprofessional/confirmpatientvaccinationinformation"
router.post('/addvaccinationcentreinformation', authMiddleware(userType.HEALTH), asyncHandler(async (req, res) => {
    const { clinicName, addressLine1, addressLine2, suburb, city, state, postcode, latitude, longitude, phone } = req.body;

    // Simple validation
    if (!clinicName || !addressLine1 || !addressLine2 || !suburb || !city || !state || !postcode || !latitude || !longitude  || !phone) {
        throw new BadRequest('Please enter all fields');
    }

    let coordinates = new Coordinates({
        latitude: latitude,
        longitude: longitude
    });

    let savedCoordinates = await coordinates.save();
    if(!savedCoordinates) throw new BadRequest('Coordinates could not be saved');

    let address = new Address({
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        suburb: suburb,
        city: city,
        state: state,
        postcode: postcode,
        coordinates: savedCoordinates
    });

    let savedAddress = await address.save();
    if(!savedAddress) throw new BadRequest('Address could not be saved');

    let clinic = new VaccinationCentre
    ({
        clinicName: clinicName,
        address: savedAddress,
        phone: phone
    });

    await clinic.save();

    res.status(200).json({
        success: true
    });
}));

module.exports = router;