const generateToken = require('../lib/utils');
const sendVerificationEmail = require('../Middleware/SendEmail');
const userModel = require('../Models/user.model');
const User = require('../Models/user.model')
const bcrypt = require('bcrypt')
const cloudinary = require('../config/cloudinary.config')

// step 1 : signup by user and get user data
module.exports.signupUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const newUser = new User({
      email,
      fullname: {
        firstName: fullname.firstName,
        lastName: fullname.lastName,
      },
      password: hashPassword,
      verificationCode,
      isVerified: false,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000 // 10 min
    })


    await newUser.save();
    const name = `${newUser.fullname.firstName} ${newUser.fullname.lastName}`;
    sendVerificationEmail(newUser.email, name, verificationCode)

    return res.status(201).json({ success: true, message: 'Account created. Please verify your email to continue', newUser })

  } catch (err) {
    console.error('Signup error:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}
// step 2.1 : verify email by otp
module.exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required"
      });
    }

    // user existed or not 
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // verified already or not
    if (user.isVerified) return res.status(400).json({ success: false, message: "Account already verified" })

    //check expired or not
    if (!user.verificationCodeExpires || Date.now() > user.verificationCodeExpires) return res.status(400).json({ success: false, message: 'Verification code expired' })

    // compare verification code vs user code
    if (code !== user.verificationCode) return res.status(400).json({ success: false, message: 'Invalid verification code' })


    // mark verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();


    // issue auth token AFTER successful verification
    const token = generateToken(user._id, user.email, res)

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar
      },
      token,
    });

  } catch (err) {
    console.error("Verify email error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
// step 2.2 : resend code and verify email by otp
module.exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email are Required" })

    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: 'User Not Found' });
    // check verify or not 
    if (user.isVerified) return res.status(400).json({ success: false, message: "Account already verified" })

    const now = Date.now()
    if (user.lastOtpRequestAt && now - user.lastOtpRequestAt < 60 * 1000) {
      const wait = Math.ceil(
        (60 * 1000 - (now - user.lastOtpRequestAt)) / 1000
      );
      return res.status(429).json({ success: false, message: `please Wait ${wait}'s before requesting a new code` })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.verificationCodeExpires = now + 10 * 60 * 1000;
    user.lastOtpRequestAt = now;

    await user.save();

    const name = `${user.fullname.firstName} ${user.fullname.lastName}`;
    // send email
    await sendVerificationEmail(user.email, name, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code resent successfully"
    });

  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}
// login if user already register
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User
      .findOne({ email })
      .select('+password');;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id, user.email, res);

    return res.status(200).json({
      success: true,
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
}
// step : 1  request password reset
module.exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    const name = `${user.fullname.firstName} ${user.fullname.lastName}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = otp;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
    user.lastPasswordResetRequestAt = Date.now();
    user.canResetPassword = false;

    await user.save();

    // send email 
    sendVerificationEmail(user.email, name, user.resetCode);

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to email"
    });

  } catch (err) {
    console.error('Request Password Reset Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }

}
// step : 2 verify reset code
module.exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required"
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // check expired or not 
    if (!user.resetCodeExpires || Date.now() > user.resetCodeExpires) return res.status(400).json({ success: false, message: 'Reset code expired' })

    // compare reset code
    if (user.resetCode !== code) return res.status(400).json({ success: false, message: 'Invalid reset code' })

    // allow user to reset password

    user.canResetPassword = true;
    // invalidate OTP (no replay)
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Reset code verified. You can now reset your password."
    });

  } catch (err) {
    console.error('Verify Reset Code Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
}
// step : 3 reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required"
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // check if allowed to reset password
    if (!user.canResetPassword) return res.status(400).json({ success: false, message: "Not authorized to reset password. Please verify reset code first." })

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update password
    user.password = hashedPassword;
    user.canResetPassword = false; // reset the flag

    // cleanup reset fields
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    generateToken(user._id, res);

    return res.status(200).json({
      success: true,
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      message: "Password reset successfully"
    });

  } catch (err) {
    console.error('Reset Password Error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
}
// get user profile
module.exports.getUserProfile = async (req, res) => {

}
// update user profile Photo
module.exports.updateUserProfile = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required"
      });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not found in request"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`chatty/avatars/${publicId}`);
      } catch { }
    }

    // Upload new avatar
    const uploadRes = await cloudinary.uploader.upload(avatar, {
      folder: "chatty/avatars",
      resource_type: "image",
      transformation: [{ width: 400, height: 400, crop: "fill" }]
    });
    // console.log("Cloudinary Upload Response:", uploadRes);
    user.avatar = uploadRes.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (err) {
    console.error("Profile Update Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// user logout 
module.exports.logoutUser = (req, res) => {
  try {
    res.cookie('token', "", { maxAge: 0 })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('Error in Logout Controller', err.message)
    res.status(500).json({ message: 'Internal Server error' })
  }
}
// check auth status
module.exports.checkAuthStatus = (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — token missing or invalid"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is authorized",
      user: req.user
    });

  } catch (err) {
    console.error("Check Auth Status Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


