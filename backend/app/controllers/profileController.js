
const User = require('../models/User')

// Get the currently authenticated student's profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.user.id,
      role: 'student',
    }).select('-password -__v')

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile fetched successfully.',
      profile: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        department: student.department || '',
        role: student.role,
        createdAt: student.createdAt,
      },
    })
  } catch (error) {
    console.error('Get student profile error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch student profile.',
    })
  }
}

// Get the currently authenticated faculty member's profile
const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await User.findOne({
      _id: req.user.id,
      role: 'faculty',
    }).select('-password -__v')

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Faculty profile fetched successfully.',
      profile: {
        id: faculty._id,
        fullName: faculty.fullName,
        email: faculty.email,
        facultyId: faculty.facultyId,
        department: faculty.department || '',
        role: faculty.role,
        createdAt: faculty.createdAt,
      },
    })
  } catch (error) {
    console.error('Get faculty profile error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch faculty profile.',
    })
  }
}

module.exports = {
  getStudentProfile,
  getFacultyProfile,
}
