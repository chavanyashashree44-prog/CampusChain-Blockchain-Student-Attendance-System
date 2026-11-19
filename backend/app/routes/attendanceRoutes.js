
const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

const {
  createSession,
  validateSession,
  submitAttendance,
  reviewAttendance,
  getPendingRequests,
  getAttendanceRecords,
  getStudentAttendanceRecords,
} = require('../controllers/attendanceController')

// Faculty: Create an attendance session
router.post(
  '/sessions',
  protect,
  authorize('faculty'),
  createSession
)

// Student: Validate a scanned QR code
router.post(
  '/validate',
  protect,
  authorize('student'),
  validateSession
)

// Student: Submit attendance
router.post(
  '/submit',
  protect,
  authorize('student'),
  submitAttendance
)

// Student: Get own attendance history
router.get(
  '/student/records',
  protect,
  authorize('student'),
  getStudentAttendanceRecords
)

// Faculty: Review student attendance
router.patch(
  '/review/:attendanceId',
  protect,
  authorize('faculty'),
  reviewAttendance
)

// Faculty: Get pending attendance requests
router.get(
  '/pending',
  protect,
  authorize('faculty'),
  getPendingRequests
)

// Faculty: Get finalized attendance records
router.get(
  '/records',
  protect,
  authorize('faculty'),
  getAttendanceRecords
)

module.exports = router
