
const crypto = require('crypto')
const mongoose = require('mongoose')

const User = require('../models/User')
const AttendanceSession = require('../models/AttendanceSession')
const Attendance = require('../models/Attendance')
const { recordAttendanceOnBlockchain } = require('./blockchainService')

// Create an attendance session with one fixed QR token
const createAttendanceSession = async (facultyId, sessionData) => {
  const faculty = await User.findById(facultyId)

  if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
    throw new Error('Only active faculty members can create attendance sessions.')
  }

  const { subject, className, section, sessionDate, startsAt, expiresAt } =
    sessionData

  if (!subject || !className || !sessionDate || !startsAt || !expiresAt) {
    throw new Error('Please provide all required session details.')
  }

  const startTime = new Date(startsAt)
  const expiryTime = new Date(expiresAt)
  const date = new Date(sessionDate)

  if (
    Number.isNaN(startTime.getTime()) ||
    Number.isNaN(expiryTime.getTime()) ||
    Number.isNaN(date.getTime())
  ) {
    throw new Error('Invalid session date or time.')
  }

  if (expiryTime <= startTime) {
    throw new Error('Expiry time must be after the start time.')
  }

  if (startTime <= new Date()) {
    throw new Error('Session start time must be in the future.')
  }

  const qrToken = crypto.randomBytes(32).toString('hex')

  const qrTokenHash = crypto
    .createHash('sha256')
    .update(qrToken)
    .digest('hex')

  const session = await AttendanceSession.create({
    faculty: facultyId,
    subject,
    className,
    section: section || '',
    sessionDate: date,
    startsAt: startTime,
    expiresAt: expiryTime,
    currentQrTokenHash: qrTokenHash,
    currentQrTokenExpiresAt: expiryTime,
  })

  return {
    session: session.toObject(),
    qrToken,
  }
}

// Validate a scanned QR code
const validateAttendanceSession = async (sessionId, qrToken) => {
  if (
    !sessionId ||
    typeof qrToken !== 'string' ||
    !/^[a-fA-F0-9]{64}$/.test(qrToken)
  ) {
    throw new Error('Invalid session ID or QR token.')
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error('Invalid attendance session ID.')
  }

  const session = await AttendanceSession.findById(sessionId)
    .select('+currentQrTokenHash')

  if (!session) {
    throw new Error('Attendance session not found.')
  }

  if (session.status !== 'active') {
    throw new Error('This attendance session is no longer active.')
  }

  const now = new Date()

  if (now < session.startsAt) {
    throw new Error('This attendance session has not started yet.')
  }

  if (now >= session.expiresAt) {
    session.status = 'expired'
    session.currentQrTokenHash = null
    session.currentQrTokenExpiresAt = null
    await session.save()

    throw new Error('This attendance session has expired.')
  }

  if (!session.currentQrTokenHash) {
    throw new Error('QR code is not available for this session.')
  }

  const submittedHash = crypto
    .createHash('sha256')
    .update(qrToken)
    .digest()

  const storedHash = Buffer.from(session.currentQrTokenHash, 'hex')

  if (
    submittedHash.length !== storedHash.length ||
    !crypto.timingSafeEqual(submittedHash, storedHash)
  ) {
    throw new Error('Invalid QR code.')
  }

  return {
    sessionId: session._id,
    subject: session.subject,
    className: session.className,
    section: session.section,
    sessionDate: session.sessionDate,
    expiresAt: session.expiresAt,
    faculty: session.faculty,
  }
}

// Submit attendance for a student
const submitStudentAttendance = async (studentId, sessionId, qrToken) => {
  const student = await User.findById(studentId)

  if (!student || student.role !== 'student' || !student.isActive) {
    throw new Error('Only active students can submit attendance.')
  }

  const validatedSession = await validateAttendanceSession(
    sessionId,
    qrToken
  )

  try {
    const attendance = await Attendance.create({
      session: validatedSession.sessionId,
      student: studentId,
      status: 'pending',
    })

    return attendance
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('You have already submitted attendance for this session.')
    }

    throw error
  }
}


// Review a student's attendance request
const reviewStudentAttendance = async (
  facultyId,
  attendanceId,
  decision,
  rejectionReason = ''
) => {
  const faculty = await User.findById(facultyId)

  if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
    throw new Error('Only active faculty members can review attendance.')
  }

  if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
    throw new Error('Invalid attendance record ID.')
  }

  if (!['present', 'rejected'].includes(decision)) {
    throw new Error('Invalid attendance review decision.')
  }

  if (
    decision === 'rejected' &&
    (typeof rejectionReason !== 'string' || !rejectionReason.trim())
  ) {
    throw new Error('A valid rejection reason is required.')
  }

  const attendance = await Attendance.findById(attendanceId)
    .populate('session')

  if (!attendance) {
    throw new Error('Attendance record not found.')
  }

  if (!attendance.session) {
    throw new Error('Associated attendance session not found.')
  }

  if (attendance.session.faculty.toString() !== facultyId.toString()) {
    throw new Error('You cannot review attendance for another faculty member.')
  }

  if (attendance.status !== 'pending') {
    throw new Error('This attendance request has already been reviewed.')
  }

  // Record approved attendance on the blockchain
  let blockchainResult = null

  if (decision === 'present') {
    blockchainResult = await recordAttendanceOnBlockchain(
      attendance.student,
      attendance.session._id
    )
  }

  // Update attendance only after blockchain recording succeeds
  attendance.status = decision
  attendance.reviewedBy = facultyId
  attendance.reviewedAt = new Date()
  attendance.rejectionReason =
    decision === 'rejected' ? rejectionReason.trim() : ''

  if (blockchainResult) {
    attendance.blockchainTxHash = blockchainResult.transactionHash
  }

  await attendance.save()

  return attendance
}


// Get pending attendance requests for sessions created by this faculty member
const getFacultyPendingRequests = async (facultyId) => {
  const faculty = await User.findById(facultyId)

  if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
    throw new Error('Only active faculty members can view attendance requests.')
  }

  const sessions = await AttendanceSession.find({
    faculty: facultyId,
  }).select('_id')

  if (sessions.length === 0) {
    return []
  }

  const sessionIds = sessions.map((session) => session._id)

  const requests = await Attendance.find({
    session: { $in: sessionIds },
    status: 'pending',
  })
    .populate('student', 'fullName email studentId department')
    .populate(
      'session',
      'subject className section sessionDate startsAt expiresAt'
    )
    .sort({ submittedAt: -1 })

  return requests
}


// Get finalized attendance records for sessions created by this faculty member
const getFacultyAttendanceRecords = async (facultyId) => {
  const faculty = await User.findById(facultyId)

  if (!faculty || faculty.role !== 'faculty' || !faculty.isActive) {
    throw new Error('Only active faculty members can view attendance records.')
  }

  const sessions = await AttendanceSession.find({
    faculty: facultyId,
  }).select('_id')

  if (sessions.length === 0) {
    return []
  }

  const sessionIds = sessions.map((session) => session._id)

  const records = await Attendance.find({
    session: { $in: sessionIds },
    status: { $in: ['present', 'rejected'] },
  })
    .populate('student', 'fullName email studentId department')
    .populate(
      'session',
      'subject className section sessionDate startsAt expiresAt'
    )
    .populate('reviewedBy', 'fullName email facultyId')
    .sort({ reviewedAt: -1 })

  return records
}


// Get attendance history for the logged-in student
const getStudentAttendanceRecords = async (studentId) => {
  const student = await User.findById(studentId)

  if (!student || student.role !== 'student' || !student.isActive) {
    throw new Error('Only active students can view attendance records.')
  }

  const records = await Attendance.find({
    student: studentId,
  })
    .populate(
      'session',
      'subject className section sessionDate startsAt expiresAt faculty'
    )
    .populate('session.faculty', 'fullName email facultyId')
    .sort({ submittedAt: -1 })

  return records
}



// Get all attendance records for Admin Dashboard
const getAllAttendanceRecords = async () => {
  const records = await Attendance.find()
    .populate('student', 'fullName email studentId department')
    .populate(
      'session',
      'subject className section sessionDate startsAt expiresAt status faculty'
    )
    .populate('session.faculty', 'fullName email facultyId')
    .populate('reviewedBy', 'fullName email facultyId')
    .sort({ submittedAt: -1 })

  return records
}

module.exports = {
  createAttendanceSession,
  validateAttendanceSession,
  submitStudentAttendance,
  reviewStudentAttendance,
  getFacultyPendingRequests,
  getFacultyAttendanceRecords,
  getStudentAttendanceRecords,
  getAllAttendanceRecords,
}

module.exports = {
  createAttendanceSession,
  validateAttendanceSession,
  submitStudentAttendance,
  reviewStudentAttendance,
  getFacultyPendingRequests,
  getFacultyAttendanceRecords,
  getStudentAttendanceRecords,
  getAllAttendanceRecords,
}
