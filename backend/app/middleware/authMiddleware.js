const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id,
      role: decoded.role,
    }

    next()
 } catch (error) {
  console.error('JWT verification error:', error.name)
  console.error('JWT verification message:', error.message)

  return res.status(401).json({
    success: false,
    message: 'Invalid or expired token.',
  })
}
}

module.exports = { protect }
