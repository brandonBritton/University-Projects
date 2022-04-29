const express = require('express')
const router = express.Router();
const BusinessOwner = require('../../../models/BusinessUser')
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const {ServerError} = require("../../../utils/errors");

/*
* @route   GET api/businessowner/profile
* @desc    Returns a business owners users profile info
* @access  Private
*/

router.get('/profile', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessOwner.findById(userId).select('-password');
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        abn: user.business.abn,
        businessName: user.business.name,
    });
}));

/*
* @route   POST api/businessowner/profile
* @desc    Updates a business owners profile info
* @access  Private
*/

router.post('/profile', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId,  firstName, lastName, phone } = req.body;

    // Simple validation
    if (!userId || !firstName || !lastName) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessOwner.findById(userId);
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
* @route   GET api/businessowner/venueinfo
* @desc    Returns business name and code
* @access  Private
*/

router.get('/venueinfo', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId } = req.body;

    // Simple validation
    if (!userId) {
        throw new BadRequest('Please enter all fields');
    }
    // Check for existing user
    const user = await BusinessOwner.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    res.status(200).json({
        success: true,
        businessName: user.business.name,
        businessCode: user.business.code
    });
}));

module.exports = router;