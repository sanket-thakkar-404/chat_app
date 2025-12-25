const jwt = require('jsonwebtoken');

const generateToken = (userId, email, res) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
    throw new Error('JWT env variables missing');
  }

  const token = jwt.sign(
    { userId , email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);

  return token;
};

module.exports = generateToken;