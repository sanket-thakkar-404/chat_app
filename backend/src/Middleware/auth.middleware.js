const jwt = require('jsonwebtoken')
const User = require('../Models/user.model')


module.exports.protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Unauthorized - no token Provided' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token' })

    const user = await User.findById(decoded.userId)

    if (!user) return res.status(404).json({ message: 'user not found' })

    req.user = user;

    next()
  } catch (err) {
    console.error('Error in Protect Routes Middleware : ' , err.message)
    res.status(500).json({message : 'Internal server Error'})
  }
}