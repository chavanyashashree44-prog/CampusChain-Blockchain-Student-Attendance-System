
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const registerUser = async (userData) => {
  const {
    fullName,
    email,
    password,
    role,
    studentId,
    facultyId,
    department,
  } = userData

  // Public registration is limited to students and faculty
  if (!['student', 'faculty'].includes(role)) {
    throw new Error('Invalid registration role')
  }

  if (role === 'student' && !studentId) {
    throw new Error('Student ID is required')
  }

  if (role === 'faculty' && !facultyId) {
    throw new Error('Faculty ID is required')
  }

  const normalizedEmail = email.toLowerCase().trim()

  const existingUser = await User.findOne({
    email: normalizedEmail,
  })

  if (existingUser) {
    throw new Error('An account with this email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    studentId: role === 'student' ? studentId : undefined,
    facultyId: role === 'faculty' ? facultyId : undefined,
    department,
  })

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }
}

const loginUser = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password')

  if (!user) {
    throw new Error('Invalid email or password')
  }

  if (!user.isActive) {
    throw new Error('Your account is inactive')
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  )

  if (!passwordMatches) {
    throw new Error('Invalid email or password')
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  }
}

module.exports = {
  registerUser,
  loginUser,
}
