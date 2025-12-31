const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    fullname: {
      firstName: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
      },
    },
    avatar: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'typing'],
      default: 'offline'
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    // ya eamil verified ka liya hai
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
    },

    verificationCodeExpires: {
      type: Date,
    },
    lastOtpRequestAt: {
      type: Date,
    },
    // for password reset
    resetCodeExpires: {
      type: Date
    },

    canResetPassword: {
      type: Boolean,
      default: false
    },

    lastPasswordResetRequestAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);