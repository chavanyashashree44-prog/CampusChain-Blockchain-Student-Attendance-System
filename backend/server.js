
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./app/config/db')
const authRoutes = require('./app/routes/authRoutes')
const profileRoutes = require('./app/routes/profileRoutes')
const attendanceRoutes = require('./app/routes/attendanceRoutes')
const adminRoutes = require('./app/routes/adminRoutes')
const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CampusChain API',
    status: 'Backend is running',
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusChain server is healthy',
    database: 'Connected',
    timestamp: new Date().toISOString(),
  })
})

// Authentication routes
app.use('/api/auth', authRoutes)

// Student profile routes
app.use('/api/profile', profileRoutes)

// Attendance routes
app.use('/api/attendance', attendanceRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`CampusChain server running on port ${PORT}`)
      console.log(`Local URL: http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
