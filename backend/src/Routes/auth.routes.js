const express = require('express');
const router = express.Router()
const authController = require('../Controller/auth.controller')
const authValidator = require('../validators/auth.validator');
const validate = require('../Middleware/auth.validate')
const authMiddleware = require('../Middleware/auth.middleware')

// login route
router.post('/login',
  authValidator.loginValidator,
  validate,
  authController.loginUser)
// forgot password routes step:1 request password reset
router.post('/request-password-reset',
  authValidator.requestResetValidator,
  validate,
  authController.requestPasswordReset)

// step : 2 verify reset code
router.post(
  "/verify-reset-code",
  authValidator.verifyResetValidator,
  validate,
  authController.verifyResetCode
);
// step : 3 reset password
router.post(
  "/reset-password",
  authValidator.resetPasswordValidator,
  validate,
  authController.resetPassword
);

// signup route step: 1 register user

router.post('/signup',
  authValidator.signupValidator,
  validate,
  authController.signupUser)

// signup route step: 2 verify email

router.post('/verify-email',
  authValidator.verifyEmailValidator,
  validate,
  authController.verifyEmail)

// resend verification code

router.post('/resend-verification',
  authValidator.resendOtpValidator,
  validate,
  authController.resendVerificationCode)

// logout route

router.post('/logout',
  authController.logoutUser)

// get user profile update route

router.put('/update-profile',
  authMiddleware.protectedRoute,
  authController.updateUserProfile)


module.exports = router;
