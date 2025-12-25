const { body } = require('express-validator');


// signup 
module.exports.signupValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email Required')
    .isEmail().withMessage('Invalid Email'),

  body('password')
    .notEmpty().withMessage('Password Required')
    .isLength({ min: 6 }).withMessage('Password Must Be 6 character'),

  body('fullname.firstName')
    .notEmpty().withMessage('First Name required')
    .isLength({ min: 3 }).withMessage('First name must be 3 Character'),

  body('fullname.lastName')
    .notEmpty().withMessage('Last Name required')
    .isLength({ min: 3 }).withMessage('First name must be 3 Character')
]

/* LOGIN */
module.exports.loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email'),

  body('password')
    .notEmpty().withMessage('Password required'),
];

module.exports.verifyEmailValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('code')
    .trim()
    .notEmpty().withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
    .isNumeric().withMessage('Verification code must contain only numbers')
];
module.exports.resendOtpValidator = [

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
];

module.exports.requestResetValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
];
module.exports.verifyResetValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("code")
    .notEmpty().withMessage("Code is required")
    .isLength({ min: 6, max: 6 }).withMessage("Code must be 6 digits")
    .isNumeric().withMessage("Code must be numeric"),
];
module.exports.resetPasswordValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("newPassword")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];