const express = require('express')
const router = express.Router()

const {
  register,
  login,
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// Public authentication routes
router.post('/register', register)
router.post('/login', login)

// Temporary protected test routes
router.get('/student-test', protect, authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student access verified successfully',
    user: req.user,
  })
})

router.get('/faculty-test', protect, authorize('faculty', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Faculty access verified successfully',
    user: req.user,
  })
})

module.exports = router