const express = require('express')
const router = express.Router();
const VaccinationRecord = require("../../../models/VaccinationRecord")
const VaccinationCentre = require("../../../models/VaccinationCentre")

const asyncHandler = require('express-async-handler');
const PositiveCase = require("../../../models/PositiveCase");
const CheckIn = require("../../../models/CheckIn");
const {BadRequest} = require('../../../utils/errors');
const moment = require("moment");
const Business = require("../../../models/Business");
const GeneralPublic = require("../../../models/GeneralPublic");
const RegisteredGeneralPublic = require("../../../models/RegisteredGeneralPublic");
const Statistics = require("../../../models/Statistics");
const {cache} = require("../../../middleware/cache");
const {convertToNumber} = require("../../../utils/general");

/**
 * @route   POST /api/generalpublic/currenthotspots
 * @desc    gets current virus hotspots
 * @access  Public
 */

router.get('/currenthotspots', asyncHandler(async (req, res) => {
    // do it the easiest way first then try aggregate
    let positiveBusinesses = await Statistics.getPositiveBusinessesCheckinDates();
    let hotspots = [];
    for (let business of positiveBusinesses){
        let positiveBusiness = await Business.findById(business.business);
        hotspots.push({
            venueName: positiveBusiness.name,
            abn: positiveBusiness.abn,
            city: positiveBusiness.address.city,
            state: positiveBusiness.address.state,
            postcode: positiveBusiness.address.postcode,
            addressLine1: positiveBusiness.address.addressLine1,
            addressLine2: positiveBusiness.address.addressLine2,
            coordinates: positiveBusiness.address.coordinates,
            date: business.dateVisited
        });
    }

    res.status(200).json({
        success: true,
        hotspots
    });
}));

/**
 * @route   POST /api/generalpublic/checkin
 * @desc    performs a checkin for a general public user
 * @access  Public
 */

router.post('/checkin', asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, venueCode } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !venueCode) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const business = await Business.findOne({ code: venueCode });
    if (!business) throw new BadRequest('Business venue does not exist');

    let generalPublic = new GeneralPublic({firstName, lastName,email, phone});
    let savedGeneralPublic = await generalPublic.save();

    let checkIn = new CheckIn({user: savedGeneralPublic, userModel: "GeneralPublic", business: business});
    let savedCheckIn = await checkIn.save();

    res.status(200).json({
        success: true,
        venueCode: business.code,
        checkinDate: savedCheckIn.date,
        businessName: business.name
    });
}));

/**
 * @route   POST /api/generalpublic/checkvaccinationisvalid
 * @desc    takes a vaccinationcode and returns if valid and other info
 * @access  Public
 */

router.post('/checkvaccinationisvalid', asyncHandler(async (req, res) => {
    const { vaccinationCode } = req.body;

    // Simple validation
    if (!vaccinationCode) {
        throw new BadRequest('Please enter vaccination code');
    }

    // Check for existing record
    const vaccinationRecord = await VaccinationRecord.findOne({ vaccinationCode });
    if (!vaccinationRecord) throw new BadRequest('Vaccination record does not exist');

    // Define return fields
    const vaccinationType = vaccinationRecord.vaccinationType;
    const vaccinationStatus = vaccinationRecord.vaccinationStatus;
    const dateAdministered = vaccinationRecord.dateAdministered;
    const patientFirstName = vaccinationRecord.patient.firstName;
    const patientLastName = vaccinationRecord.patient.lastName;

    res.status(200).json({
        success: true,
        vaccinationType,
        vaccinationStatus,
        dateAdministered,
        patientFirstName,
        patientLastName
    });
}));

/**
 * @route   POST /api/generalpublic/vaccinationcentres
 * @desc    returns an array of vaccine centres
 * @access  Public
 */

router.get('/vaccinationcentres', asyncHandler(async (req, res) => {
    const vaccinationCentre = await VaccinationCentre.find().sort({ clinicName: 1 });
    const vaccinationCentres = [];

    // iterates through and pushes all vaccination centres to the return array
    vaccinationCentre.forEach(vaccinationCentre =>
        vaccinationCentres.push(
            {
                clinicName:vaccinationCentre.clinicName,
                phone:vaccinationCentre.phone,
                addressLine1:vaccinationCentre.address.addressLine1,
                addressLine2:vaccinationCentre.address.addressLine2,
                suburb:vaccinationCentre.address.suburb,
                city:vaccinationCentre.address.city,
                state:vaccinationCentre.address.state,
                postcode:vaccinationCentre.address.postcode,
                coordinates: vaccinationCentre.address.coordinates
            }
        )
    );

    res.status(200).json({
        success: true,
        vaccinationCentres
    });
}));

/**
 * @route   POST /api/generalpublic/homepagestats
 * @desc    returns an object of stats
 * @access  Public
 */

router.get('/homepagestats', asyncHandler(async (req, res) => {
    let statistics = await Statistics.getSingleton();
    let stats = {
        covidSummary:
            {
                totalHospitalised: statistics.covidSummary.totalHospitalised,
                totalDeaths: statistics.covidSummary.totalDeaths,
                totalTests: statistics.covidSummary.totalTests,
                totalTestsLast24Hours: statistics.covidSummary.totalTestsLast24Hours,
                totalOverseasCasesLast24Hours: statistics.covidSummary.totalOverseasCasesLast24Hours,
                totalCurrentHotspotVenues: statistics.covidSummary.totalCurrentHotspotVenues,
                totalPositiveCasesLast24Hours: statistics.covidSummary.totalPositiveCasesLast24Hours,
                totalPositiveCases: statistics.covidSummary.totalPositiveCases
            },
        checkinsSummary: {
            totalCheckins: statistics.checkinsSummary.totalCheckins,
            checkinsLast24Hours: statistics.checkinsSummary.checkinsLast24Hours
        },
        businessesSummary: {
            totalBusinessesRegistered: statistics.businessesSummary.totalBusinessesRegistered,
            businessesDeemedHotspot24Hours: statistics.businessesSummary.businessesDeemedHotspot24Hours.length
        },
        vaccinationsSummary: {
            vaccinationsYesterday: statistics.vaccinationsSummary.vaccinationsYesterday,
            totalVaccinations: statistics.vaccinationsSummary.totalVaccinations,
            totalVaccinationCentres: statistics.vaccinationsSummary.totalVaccinationCentres
        },
        usersSummary: {
            totalRegisteredGeneralPublicUsers: statistics.usersSummary.totalRegisteredGeneralPublicUsers
        }
    };

    // add rest of logic
    res.status(200).json({
        success: true,
        stats
    });
}));
module.exports = router;
