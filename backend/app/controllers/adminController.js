
const User = require('../models/User')
const Attendance = require('../models/Attendance')
const AttendanceSession = require('../models/AttendanceSession')
const {
  getAllAttendanceRecords,
} = require('../services/attendanceService')
const {
  verifyAttendanceOnBlockchain,
} = require('../services/blockchainService')


// Get Admin Dashboard overview statistics
const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      totalAttendance,
      pendingAttendance,
      presentAttendance,
      rejectedAttendance,
      absentAttendance,
      totalSessions,
      activeSessions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Attendance.countDocuments(),
      Attendance.countDocuments({ status: 'pending' }),
      Attendance.countDocuments({ status: 'present' }),
      Attendance.countDocuments({ status: 'rejected' }),
      Attendance.countDocuments({ status: 'absent' }),
      AttendanceSession.countDocuments(),
      AttendanceSession.countDocuments({ status: 'active' }),
    ])

    // Independently verify records against the smart contract
    const blockchainRecords = await Attendance.find({
      blockchainTxHash: { $exists: true, $nin: [null, ''] },
    }).select('student session')

    const verificationResults = await Promise.all(
      blockchainRecords.map(async (record) => {
        try {
          const result = await verifyAttendanceOnBlockchain(
            record.student,
            record.session
          )

          return result.recorded === true
        } catch (error) {
          console.error(
            'Blockchain overview verification failed:',
            record._id,
            error.message
          )
          return false
        }
      })
    )

    const blockchainVerifiedAttendance = verificationResults.filter(
      (verified) => verified
    ).length

    return res.status(200).json({
      success: true,
      message: 'Admin overview loaded successfully.',
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          faculty: totalFaculty,
          admins: totalAdmins,
          active: activeUsers,
          inactive: inactiveUsers,
        },
        attendance: {
          total: totalAttendance,
          pending: pendingAttendance,
          present: presentAttendance,
          rejected: rejectedAttendance,
          absent: absentAttendance,
        },
        blockchain: {
          verifiedRecords: blockchainVerifiedAttendance,
        },
        sessions: {
          total: totalSessions,
          active: activeSessions,
        },
      },
    })
  } catch (error) {
    console.error('Admin overview error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load Admin dashboard statistics.',
    })
  }
}

// Get all users for Admin User Management
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('fullName email role studentId facultyId department isActive createdAt')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: 'Users loaded successfully.',
      data: users,
    })
  } catch (error) {
    console.error('Admin users error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load users.',
    })
  }
}

// Get all attendance records for Admin Attendance Monitoring
const getAdminAttendance = async (req, res) => {
  try {
    const records = await getAllAttendanceRecords()

    return res.status(200).json({
      success: true,
      message: 'Attendance records loaded successfully.',
      count: records.length,
      data: records,
    })
  } catch (error) {
    console.error('Admin attendance error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load attendance records.',
    })
  }
}



const getAdminBlockchainMonitoring = async (req, res) => {
  try {
    const records = await Attendance.find({
      blockchainTxHash: { $exists: true, $nin: [null, ''] },
    })
      .populate('student', 'fullName email studentId')
      .populate('session', 'subject className section sessionDate')
      .sort({ createdAt: -1 })

    const totalAttendance = await Attendance.countDocuments()

    // Verify each attendance record directly on blockchain
    const verifiedRecords = await Promise.all(
      records.map(async (record) => {
        try {
          const result = await verifyAttendanceOnBlockchain(
            record.student._id,
            record.session._id
          )

          return {
            ...record.toObject(),
            blockchainVerification: {
              verified: result.recorded,
              timestamp: result.timestamp,
              approvedBy: result.approvedBy,
            },
          }
        } catch (error) {
          console.error(
            'Blockchain verification failed:',
            record._id,
            error.message
          )

          return {
            ...record.toObject(),
            blockchainVerification: {
              verified: false,
              timestamp: null,
              approvedBy: null,
            },
          }
        }
      })
    )

    const verifiedCount = verifiedRecords.filter(
      (record) => record.blockchainVerification.verified
    ).length

    return res.status(200).json({
      success: true,
      message: 'Blockchain monitoring data loaded successfully.',
      data: {
        totalAttendance,
        totalTransactions: records.length,
        verifiedTransactions: verifiedCount,
        unverifiedTransactions: records.length - verifiedCount,
        recordsWithoutTransaction: totalAttendance - records.length,
        transactions: verifiedRecords,
      },
    })
  } catch (error) {
    console.error('Admin blockchain monitoring error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load blockchain monitoring data.',
    })
  }
}


module.exports = {
  getAdminOverview,
  getAdminUsers,
  getAdminAttendance,
  getAdminBlockchainMonitoring,
}