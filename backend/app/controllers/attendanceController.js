
const {
  createAttendanceSession,
  validateAttendanceSession,
  submitStudentAttendance,
  reviewStudentAttendance,
  getFacultyPendingRequests,
  getFacultyAttendanceRecords,
  getStudentAttendanceRecords: fetchStudentAttendanceRecords,
} = require('../services/attendanceService')

// Create an attendance session and generate its fixed QR token
const createSession = async (req, res) => {
  try {
    const result = await createAttendanceSession(
      req.user.id,
      req.body
    )

    return res.status(201).json({
      success: true,
      message: 'Attendance session and QR code created successfully.',
      data: {
        session: result.session,
        token: result.qrToken,
      },
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Validate a scanned QR code
const validateSession = async (req, res) => {
  try {
    const { sessionId, token } = req.body

    const session = await validateAttendanceSession(
      sessionId,
      token
    )

    return res.status(200).json({
      success: true,
      message: 'Attendance QR code is valid.',
      data: session,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Submit student attendance
const submitAttendance = async (req, res) => {
  try {
    const { sessionId, token } = req.body

    const attendance = await submitStudentAttendance(
      req.user.id,
      sessionId,
      token
    )

    return res.status(201).json({
      success: true,
      message: 'Attendance submitted successfully. Awaiting faculty approval.',
      data: attendance,
    })
  } catch (error) {
    const statusCode = error.message.includes('already submitted') ? 409 : 400

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    })
  }
}

// Review student attendance
const reviewAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params
    const { decision, rejectionReason } = req.body

    const attendance = await reviewStudentAttendance(
      req.user.id,
      attendanceId,
      decision,
      rejectionReason
    )

    return res.status(200).json({
      success: true,
      message: `Attendance ${decision} successfully.`,
      data: attendance,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get pending attendance requests for the logged-in faculty member
const getPendingRequests = async (req, res) => {
  try {
    const requests = await getFacultyPendingRequests(req.user.id)

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Get finalized attendance records for the logged-in faculty member
const getAttendanceRecords = async (req, res) => {
  try {
    const records = await getFacultyAttendanceRecords(req.user.id)

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}




const getStudentAttendanceRecords = async (req, res) => {
  try {
    const records = await fetchStudentAttendanceRecords(req.user.id)

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  createSession,
  validateSession,
  submitAttendance,
  reviewAttendance,
  getPendingRequests,
  getAttendanceRecords,
  getStudentAttendanceRecords,
}
