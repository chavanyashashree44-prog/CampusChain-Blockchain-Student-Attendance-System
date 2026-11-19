const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const User = require('./app/models/User')

const resetFacultyPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    const email = process.env.FACULTY_EMAIL?.toLowerCase().trim()
    const newPassword = process.env.FACULTY_NEW_PASSWORD

    if (!email || !newPassword) {
      throw new Error('Please configure FACULTY_EMAIL and FACULTY_NEW_PASSWORD in .env')
    }

    const faculty = await User.findOne({
      email,
      role: 'faculty',
    })

    if (!faculty) {
      throw new Error('Faculty account not found.')
    }

    faculty.password = await bcrypt.hash(newPassword, 12)

    await faculty.save()

    console.log('Faculty password reset successfully.')
    console.log('Faculty email:', email)
  } catch (error) {
    console.error('Password reset failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

resetFacultyPassword()