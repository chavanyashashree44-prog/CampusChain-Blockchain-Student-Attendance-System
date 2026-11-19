
const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'present', 'absent', 'rejected'],
      default: 'pending',
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },

    blockchainTxHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// One attendance submission per student per session
attendanceSchema.index(
  { session: 1, student: 1 },
  { unique: true }
)

attendanceSchema.index({ student: 1, createdAt: -1 })

module.exports = mongoose.model('Attendance', attendanceSchema)
