const transporter = require('../config/email.config');
const VerificationTemplate = require('./verifyCodeTemplate')


const sendVerificationEmail = async (email, name, otp) => {
  try {
    const res = await transporter.sendMail({
      from: `"Chatty Website" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Email Verification",
      text: `Hello ${name}`, // Plain-text version of the message
      html: VerificationTemplate.Verification_Email_Template(name, otp), // HTML version of the message
    });

    console.log('Email Sent Successfully', res.messageId)
  } catch (err) {
    console.error("Email Sending Error:", err.message);
  }
}




module.exports = sendVerificationEmail