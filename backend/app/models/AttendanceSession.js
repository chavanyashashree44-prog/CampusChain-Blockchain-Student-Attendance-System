
const mongoose = require('mongoose')

const attendanceSessionSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
      default: '',
    },

    sessionDate: {
      type: Date,
      required: true,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    // Hash of the currently valid rotating QR token
    currentQrTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    // Expiry time of the current QR token
    currentQrTokenExpiresAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ['active', 'closed', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Prevent invalid session time ranges
attendanceSessionSchema.pre('validate', function () {
  if (this.expiresAt <= this.startsAt) {
    this.invalidate('expiresAt', 'Expiry time must be after the start time.')
  }
})

// Useful indexes for session queries
attendanceSessionSchema.index({ faculty: 1, sessionDate: -1 })
attendanceSessionSchema.index({ status: 1, expiresAt: 1 })

module.exports = mongoose.model(
  'AttendanceSession',
  attendanceSessionSchema
)
