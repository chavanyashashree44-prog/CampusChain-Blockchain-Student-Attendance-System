
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

dotenv.config()

const connectDB = require('./app/config/db')
const User = require('./app/models/User')

const createAdmin = async () => {
  try {
    await connectDB()

    const fullName = process.env.ADMIN_NAME
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
    const password = process.env.ADMIN_PASSWORD

    if (!fullName || !email || !password) {
      throw new Error('Please configure ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env')
    }

    if (password.length < 12) {
      throw new Error('Admin password must contain at least 12 characters.')
    }

    const existingAdmin = await User.findOne({ email })

    if (existingAdmin) {
      throw new Error('An account with this email already exists. No changes made.')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    })

    console.log('Admin account created successfully.')
    console.log(`Admin email: ${email}`)
  } catch (error) {
    console.error('Admin creation failed:', error.message)
    process.exitCode = 1
  } finally {
    const mongoose = require('mongoose')
    await mongoose.disconnect()
  }
}

createAdmin()
