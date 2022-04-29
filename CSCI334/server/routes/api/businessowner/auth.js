const express = require('express')
const router = express.Router();
const BusinessUser = require('../../../models/BusinessUser')
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes");
const {BadRequest} = require('../../../utils/errors');
const asyncHandler = require('express-async-handler');
const Business = require("../../../models/Business");
const Address = require("../../../models/Address");
const {createAuthToken} = require("../../../utils/general");
const {Unauthorized} = require("../../../utils/errors");
const {ServerError} = require("../../../utils/errors");
const {Emailer} = require("../../../utils/general");

/**
 * @route   POST api/businessowner/auth/login
 * @desc    logging in user
 * @access  Public
 */

router.post('/login', asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // Simple validation
    if (!email || !password) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessUser.findOne({email}).select("+password");
    if (!user) throw new BadRequest('User does not exist');

    let isMatch;
    let isTemporary = false;

    if(user.isTemporaryExpiryValid()){
        isMatch = user.compareTemporaryPassword(password);
        isTemporary = true;
        user.passwordReset = undefined;
        const savedUser = await user.save();
        if (!savedUser) throw new ServerError('Something went wrong updating the user');
    } else {
        isMatch = user.comparePassword(password);
    }

    if (!isMatch) throw new BadRequest('Invalid credentials');

    const token = createAuthToken(user._id, userType.BUSINESS);
    if (!token) throw new BadRequest('Couldn\'t sign the token');

    user.accessToken = token;

    const savedUser = await user.save();
    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    res.status(200).json({
        success: true,
        token,
        type: userType.BUSINESS,
        isTemporary
    });
}));

/**
 * @route   POST api/businessowner/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password, phone, abn, businessName, addressLine1, addressLine2, suburb, city, state, postcode} = req.body;
    // Simple validation
    if (!firstName || !lastName || !email || !password || !abn || !businessName || !addressLine1 || !suburb || !city || !state || !postcode) {
        throw new BadRequest('Please enter all fields');
    }

    const user = await BusinessUser.findOne({email});
    if (user) throw new BadRequest('User already exists');

    const newAddress = new Address({
        addressLine1,
        addressLine2,
        suburb,
        city,
        state,
        postcode
    });

    const savedAddress = await newAddress.save();
    if (!savedAddress) throw new ServerError('Something went wrong saving the user');

    const newBusiness = new Business({
        abn,
        name: businessName,
        address: newAddress
    });
    const savedBusiness = await newBusiness.save();
    if (!savedBusiness) throw new ServerError('Something went wrong saving the user');

    const newUser = new BusinessUser({
        firstName,
        lastName,
        email,
        password,
        phone,
        business: newBusiness
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    const token = createAuthToken(savedUser.id, userType.BUSINESS);

    savedUser.accessToken = token;

    const savedUser2 = await savedUser.save();
    if (!savedUser2) throw new ServerError('Something went wrong saving the user');

    res.status(200).json({
        success: true,
        token,
        type: userType.BUSINESS
    });
}));


/*
* @route   POST api/businessowner/auth/changepassword
* @desc    Change password
* @access  Private
*/

router.post('/changepassword', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId, newPassword, confirmPassword } = req.body;

    // Simple validation
    if (!userId || !newPassword || !confirmPassword) {
        throw new BadRequest('Please enter all fields');
    }

    if (newPassword !== confirmPassword) {
        throw new BadRequest('Password and confirm password do not match');
    }

    // Check for existing user
    const user = await BusinessUser.findById(userId).select("+password");
    if (!user) throw new BadRequest('User does not exist');

    user.password = newPassword;

    const savedUser = await user.save();

    if (!savedUser) throw new ServerError('Something went wrong saving the user');
    res.status(200).json({
        success: true,
    });
}));

/*
* @route   POST api/businessowner/auth/forgotpassword
* @desc    Forgot password
* @access  Public
*/

router.post('/forgotpassword', asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Simple validation
    if (!email) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessUser.findOne({email});
    if (!user) throw new BadRequest('User does not exist');

    let temporaryPassword = user.setTemporaryPassword();

    const savedUser = await user.save();

    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    const msg = {
        to: user.email, // Change to your recipient
        from: process.env.SENDGRID_FROM_EMAIL, // Change to your verified sender
        subject: 'Reset Password',
        html: `<strong>The following is your one-time temporary password to login for ${user.email}. It expires in 1 hour.<br>You will be directed to change your password after you login: ${temporaryPassword}</strong>`,
    }

    const msgSent = await Emailer.sendEmail(msg);

    if(!msgSent || msgSent[0].statusCode !== 202){
        throw new ServerError("Error sending email");
    }

    res.status(200).json({
        success: true,
    });
}));

/*
* @route   GET api/businessowner/auth/user
* @desc    Check user logged in
* @access  Private
*/

router.get('/user', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    res.json({success: true});
}));

/**
 * @route   GET api/registeredgeneralpublic/auth/logout
 * @desc    Logout user
 * @access  Private
 */

router.get('/logout', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const user = await BusinessUser.findById(req.body.userId);
    if (!user) throw new Unauthorized('User does not exist');
    user.accesssToken = undefined;
    const savedUser = await user.save();
    if(!savedUser) throw new BadRequest('Error logging out user');
    res.json({success: true});
}));

module.exports = router;