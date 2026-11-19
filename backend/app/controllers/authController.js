
const {
  registerUser,
  loginUser,
} = require('../services/authService')

// Register a new student or faculty account
const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      studentId,
      facultyId,
      department,
    } = req.body

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters',
      })
    }

    const user = await registerUser({
      fullName,
      email,
      password,
      role,
      studentId,
      facultyId,
      department,
    })

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user,
    })
  } catch (error) {
    const statusCode =
      error.message.includes('already exists') ? 409 :
      error.message.includes('required') ||
      error.message.includes('Invalid registration role') ? 400 :
      500

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Registration failed',
    })
  }
}

// Login an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const result = await loginUser(email, password)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    const statusCode =
      error.message === 'Invalid email or password' ? 401 :
      error.message === 'Your account is inactive' ? 403 :
      500

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Login failed',
    })
  }
}

module.exports = {
  register,
  login,
}
