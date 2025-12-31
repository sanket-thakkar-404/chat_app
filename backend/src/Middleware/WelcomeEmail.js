const transporter = require('../config/email.config');
const VerificationTemplate = require('./verifyCodeTemplate')


const WelcomeEmail = async (email, name) => {
  try {
    const res = await transporter.sendMail({
      from: `"TALKS Website" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome To Our TALKS App",
      text: `Hello ${name}`, // Plain-text version of the message
      html: VerificationTemplate.Welcome_Email_Template(name), // HTML version of the message
    });
    console.log('Welcome Email Sent Successfully')
    return res;

  } catch (err) {
    console.error("Email Sending Error:", err.message);
  }
}




module.exports = WelcomeEmail