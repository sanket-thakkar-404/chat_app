module.exports.Verification_Email_Template = (name, verificationCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your TalkS Account</title>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background: #f4f6fb;
      color: #333;
    }

    .container {
      max-width: 650px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e1e1e1;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      padding: 28px;
    }

    .logo {
      text-align: left;
      margin-bottom: 18px;
    }

    .logo-icon {
      padding : 42px;
      text-align: center;
      border-radius: 8px;
      background: #5d5fef;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      margin: 10px 0 16px 0;
    }

    .text-block {
      line-height: 1.7;
      margin-bottom: 14px;
    }

    .otp-box {
      display: block;
      margin: 15px 0 20px 0;
      padding: 12px 18px;
      background: transparent;
      border: 2px dashed #5d5fef;
      text-align: center;
      color: black;
      font-weight: bold;
      font-size: 30px;
      border-radius: 6px;
      letter-spacing: 3px;
    }

    .section-title {
      margin-top: 10px;
      font-weight: bold;
    }

    .bullet-list {
      margin-top: 6px;
      padding-left: 18px;
    }

    .footer {
      margin-top: 25px;
      font-size: 12px;
      color: #777;
      text-align: left;
    }
  </style>
</head>

<body>

<div class="container">

  <div class="logo">
    <div class="logo-icon">T</div>
  </div>

  <div class="title">Verify Your TALKS Account</div>

  <p class="text-block">Hey ${name},</p>

  <p class="text-block">
    Thanks for signing up! To finish creating your <b>TALKS</b> account,
    please verify your email using the code below:
  </p>

  <div class="otp-box">
    ${verificationCode}
  </div>

  <p class="text-block">
    Enter this verification code inside the TALKS app to continue.
  </p>

  <p class="section-title">A few things to keep in mind:</p>

  <ul class="bullet-list">
    <li>Your code is valid for <strong>10 minutes</strong>.</li>
    <li>Do not share this code with anyone.</li>
    <li>If you didn’t request this — you can ignore this email.</li>
  </ul>

  <p class="text-block">
    Feel free to reply if you need help — we’re here for you.
  </p>

  <p class="text-block">
    — The TALKS Team
  </p>

  <div class="footer">
    &copy; ${new Date().getFullYear()} TALKS • Secure Messaging Platform
  </div>

</div>

</body>
</html>`,






  module.exports.Welcome_Email_Template = (name) =>
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to TALKS</title>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      color: #333;
    }

    .container {
      max-width: 640px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e1e1e1;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .header {
      background: #5d5fef;
      color: #ffffff;
      padding: 22px;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      letter-spacing: 0.4px;
    }

    .content {
      padding: 26px;
      line-height: 1.7;
    }

    .welcome {
      font-size: 18px;
      margin: 6px 0 14px 0;
      font-weight: 600;
    }

    .features {
      margin: 10px 0 22px 0;
      padding-left: 18px;
    }

    .cta-btn {
      display: inline-block;
      margin-top: 10px;
      padding: 12px 22px;
      background: #5d5fef;
      color: #ffffff;
      text-decoration: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: bold;
    }

    .cta-btn:hover {
      background: #3f41d6;
    }

    .info-note {
      margin-top: 18px;
      color: #666;
    }

    .footer {
      background: #fafafa;
      text-align: center;
      padding: 14px;
      font-size: 12px;
      color: #777;
      border-top: 1px solid #e3e3e3;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="header">
      Welcome to TALKS 🎉
    </div>

    <div class="content">

      <p class="welcome">Hi ${name},</p>

      <p>
        We're excited to have you on board — your TALKS account is now active.
      </p>

      <p>
        TALKS helps you connect faster, chat smarter, and stay in sync across all your devices.
        Here’s what you can start doing right away:
      </p>

      <ul class="features">
        <li>Start private chats with friends & contacts</li>
        <li>Create and manage group conversations</li>
        <li>Share images, files, and voice messages</li>
        <li>Access your chats seamlessly across devices</li>
      </ul>

      <a href="#" class="cta-btn">Open TALKS App</a>

      <p class="info-note">
        If you didn’t create this account, please contact our support team immediately.
      </p>

    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} TALKS — Secure Messaging Platform
    </div>

  </div>

</body>
</html>
`
