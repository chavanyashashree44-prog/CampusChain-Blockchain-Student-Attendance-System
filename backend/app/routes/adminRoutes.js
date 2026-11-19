const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

const {
  getAdminOverview,
  getAdminUsers,
  getAdminAttendance,
  getAdminBlockchainMonitoring,
} = require('../controllers/adminController')

// Admin dashboard overview
router.get(
  '/overview',
  protect,
  authorize('admin'),
  getAdminOverview
)

// Admin user management
router.get(
  '/users',
  protect,
  authorize('admin'),
  getAdminUsers
)

// Admin attendance monitoring
router.get(
  '/attendance',
  protect,
  authorize('admin'),
  getAdminAttendance
)

// Admin blockchain monitoring
router.get(
  '/blockchain',
  protect,
  authorize('admin'),
  getAdminBlockchainMonitoring
)

console.log('CampusChain ADMIN ROUTES loaded')
module.exports = router