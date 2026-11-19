
const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const {
  getStudentProfile,
  getFacultyProfile,
} = require('../controllers/profileController')

// Protected student profile endpoint
router.get('/student', protect, getStudentProfile)

// Protected faculty profile endpoint
router.get('/faculty', protect, getFacultyProfile)

module.exports = router
