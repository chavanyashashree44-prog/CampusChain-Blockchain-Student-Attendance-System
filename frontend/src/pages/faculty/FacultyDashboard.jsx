
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import {
  LayoutDashboard,
  PlusCircle,
  QrCode,
  ClipboardList,
  History,
  UserCircle,
  LogOut,
  GraduationCap,
  CalendarDays,
  Clock,
  BookOpen,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function FacultyDashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [qrData, setQrData] = useState(null)

  const [pendingRequests, setPendingRequests] = useState([])
const [requestsLoading, setRequestsLoading] = useState(false)
const [requestsError, setRequestsError] = useState('')
const [reviewingId, setReviewingId] = useState(null)
const [rejectionReasons, setRejectionReasons] = useState({})

const [attendanceRecords, setAttendanceRecords] = useState([])
const [recordsLoading, setRecordsLoading] = useState(false)
const [recordsError, setRecordsError] = useState('')

const [facultyProfile, setFacultyProfile] = useState(null)
const [profileLoading, setProfileLoading] = useState(false)
const [profileError, setProfileError] = useState('')

  const [formData, setFormData] = useState({
    subject: '',
    className: '',
    section: '',
    sessionDate: '',
    startsAt: '',
    expiresAt: '',
  })

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Create Session', icon: PlusCircle },
    { name: 'QR Attendance', icon: QrCode },
    { name: 'Attendance Requests', icon: ClipboardList },
    { name: 'Attendance Records', icon: History },
    { name: 'My Profile', icon: UserCircle },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('campuschain_token')
    sessionStorage.removeItem('campuschain_user')
    navigate('/login')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateSession = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setQrData(null)

    if (
      !formData.subject.trim() ||
      !formData.className.trim() ||
      !formData.sessionDate ||
      !formData.startsAt ||
      !formData.expiresAt
    ) {
      setError('Please fill in all required fields.')
      return
    }

    const startsAt = new Date(
      `${formData.sessionDate}T${formData.startsAt}`
    )

    const expiresAt = new Date(
      `${formData.sessionDate}T${formData.expiresAt}`
    )

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(expiresAt.getTime())
    ) {
      setError('Please enter a valid date and time.')
      return
    }

    if (expiresAt <= startsAt) {
      setError('Expiry time must be after the start time.')
      return
    }

    if (startsAt <= new Date()) {
      setError('Session start time must be in the future.')
      return
    }

    try {
      setLoading(true)

      const token = sessionStorage.getItem('campuschain_token')

      const response = await api.post(
        '/attendance/sessions',
        {
          subject: formData.subject.trim(),
          className: formData.className.trim(),
          section: formData.section.trim(),
          sessionDate: formData.sessionDate,
          startsAt: startsAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const session = response.data.data.session
      const qrToken = response.data.data.token

      const qrPayload = JSON.stringify({
        sessionId: session._id,
        token: qrToken,
      })

      setQrData({
        session,
        qrPayload,
      })

      setSuccess('Attendance session created successfully!')
      setActiveTab('QR Attendance')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to create attendance session. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

 const fetchPendingRequests = async () => {
  try {
    setRequestsLoading(true)
    setRequestsError('')

    const token = sessionStorage.getItem('campuschain_token')

    const response = await api.get('/attendance/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setPendingRequests(response.data.data || [])
  } catch (err) {
    setRequestsError(
      err.response?.data?.message ||
      'Unable to load attendance requests. Please try again.'
    )
  } finally {
    setRequestsLoading(false)
  }
}

const fetchAttendanceRecords = async () => {
  try {
    setRecordsLoading(true)
    setRecordsError('')

    const token = sessionStorage.getItem('campuschain_token')

    const response = await api.get('/attendance/records', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setAttendanceRecords(response.data.data || [])
  } catch (err) {
    setRecordsError(
      err.response?.data?.message ||
      'Unable to load attendance records. Please try again.'
    )
  } finally {
    setRecordsLoading(false)
  }
}


const fetchOverviewData = async () => {
  await Promise.all([
    fetchPendingRequests(),
    fetchAttendanceRecords(),
  ])
}


const fetchFacultyProfile = async () => {
  try {
    setProfileLoading(true)
    setProfileError('')

    const token = sessionStorage.getItem('campuschain_token')

    const response = await api.get('/profile/faculty', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setFacultyProfile(response.data.profile)
  } catch (err) {
    setProfileError(
      err.response?.data?.message ||
      'Unable to load faculty profile. Please try again.'
    )
  } finally {
    setProfileLoading(false)
  }
}


const handleReviewRequest = async (attendanceId, decision) => {
  const rejectionReason =
    rejectionReasons[attendanceId]?.trim() || ''

  if (decision === 'rejected' && !rejectionReason) {
    setRequestsError('Please enter a reason for rejection.')
    return
  }

  try {
    setReviewingId(attendanceId)
    setRequestsError('')
    setSuccess('')

    const token = sessionStorage.getItem('campuschain_token')

    await api.patch(
      `/attendance/review/${attendanceId}`,
      {
        decision,
        ...(decision === 'rejected' && { rejectionReason }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    setSuccess(
      decision === 'present'
        ? 'Attendance approved successfully!'
        : 'Attendance rejected successfully!'
    )

    setRejectionReasons((prev) => ({
      ...prev,
      [attendanceId]: '',
    }))

    await fetchPendingRequests()
  } catch (err) {
    setRequestsError(
      err.response?.data?.message ||
      'Unable to review attendance request. Please try again.'
    )
  } finally {
    setReviewingId(null)
  }
}

const downloadQRCode = () => {
  const canvas = document.getElementById('faculty-attendance-qr')

  if (!canvas) return

  const link = document.createElement('a')
  link.download = 'CampusChain-Attendance-QR.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

  const renderContent = () => {
    if (activeTab === 'Create Session') {
      return (
        <div className="max-w-3xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Create Attendance Session
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter class details and create a fixed QR code for attendance.
            </p>
          </div>

          <form
            onSubmit={handleCreateSession}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subject *
                </label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Blockchain Technology"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Class *
                </label>
                <input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g. Final Year"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Section
                </label>
                <input
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Session Date *
                </label>
                <input
                  type="date"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  min={new Date().toLocaleDateString('en-CA')}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startsAt"
                  value={formData.startsAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Expiry Time *
                </label>
                <input
                  type="time"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  The QR code remains valid until this time.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle size={18} />
              {loading ? 'Creating Session...' : 'Create Session & Generate QR'}
            </button>
          </form>
        </div>
      )
    }

    if (activeTab === 'QR Attendance') {
      return (
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            QR Attendance
          </h2>
          <p className="mb-6 mt-1 text-sm text-slate-500">
            Display the generated QR code for students to scan.
          </p>

          {qrData ? (
            <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={25} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {qrData.session.subject}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {qrData.session.className}
                  {qrData.session.section
                    ? ` - Section ${qrData.session.section}`
                    : ''}
                </p>
              </div>

              <div className="flex justify-center rounded-xl bg-white p-5">
                <QRCodeCanvas
                  id="faculty-attendance-qr"
                  value={qrData.qrPayload}
                  size={240}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="mt-4 text-center text-sm font-medium text-green-700">
                Fixed QR code generated successfully
              </p>

              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                <p>
                  <strong>Session ID:</strong> {qrData.session._id}
                </p>
                <p className="mt-2">
                  <strong>Valid until:</strong>{' '}
                  {new Date(qrData.session.expiresAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={downloadQRCode}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
              >
                <Download size={18} />
                Download QR Code
              </button>
            </div>
          ) : (
            <div className="max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <QrCode size={45} className="mx-auto text-violet-500" />
              <h3 className="mt-4 font-semibold text-slate-800">
                No QR Code Generated
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create an attendance session first to generate its QR code.
              </p>
              <button
                onClick={() => setActiveTab('Create Session')}
                className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700"
              >
                Create Session
              </button>
            </div>
          )}
        </div>
      )
    }

if (activeTab === 'Attendance Requests') {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Attendance Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review attendance submissions from your students.
          </p>
        </div>

        <button
          onClick={fetchPendingRequests}
          disabled={requestsLoading}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {requestsLoading ? 'Refreshing...' : 'Refresh Requests'}
        </button>
      </div>

      {requestsError && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {requestsError}
        </div>
      )}

      {requestsLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading attendance requests...
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <ClipboardList
            size={42}
            className="mx-auto text-violet-500"
          />
          <h3 className="mt-4 font-semibold text-slate-800">
            No Pending Requests
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Student attendance submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">
                    {request.student?.fullName || 'Unknown Student'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Student ID: {request.student?.studentId || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {request.student?.email || 'N/A'}
                  </p>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Pending
                </span>
              </div>

              <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <p>
                  <strong>Subject:</strong>{' '}
                  {request.session?.subject || 'N/A'}
                </p>
                <p>
                  <strong>Class:</strong>{' '}
                  {request.session?.className || 'N/A'}
                </p>
                <p>
                  <strong>Section:</strong>{' '}
                  {request.session?.section || 'N/A'}
                </p>
                <p>
                  <strong>Submitted:</strong>{' '}
                  {request.submittedAt
                    ? new Date(request.submittedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

<div className="mt-5 border-t border-slate-100 pt-5">
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Rejection Reason (required when rejecting)
  </label>

  <textarea
    value={rejectionReasons[request._id] || ''}
    onChange={(e) =>
      setRejectionReasons((prev) => ({
        ...prev,
        [request._id]: e.target.value,
      }))
    }
    placeholder="Enter reason if you want to reject this request..."
    rows={2}
    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500"
  />

  <div className="mt-4 flex flex-wrap gap-3">
    <button
      onClick={() => handleReviewRequest(request._id, 'present')}
      disabled={reviewingId === request._id}
      className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
    >
      {reviewingId === request._id ? 'Processing...' : 'Approve'}
    </button>

    <button
      onClick={() => handleReviewRequest(request._id, 'rejected')}
      disabled={reviewingId === request._id}
      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
    >
      Reject
    </button>
  </div>
</div>

            </div>
    ))}
        </div>
      )}
    </div>
  )
}


if (activeTab === 'Attendance Records') {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Attendance Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View approved and rejected attendance records for your classes.
          </p>
        </div>

        <button
          onClick={fetchAttendanceRecords}
          disabled={recordsLoading}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {recordsLoading ? 'Refreshing...' : 'Refresh Records'}
        </button>
      </div>

      {recordsError && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {recordsError}
        </div>
      )}

      {recordsLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading attendance records...
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <History size={42} className="mx-auto text-violet-500" />
          <h3 className="mt-4 font-semibold text-slate-800">
            No Attendance Records
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Approved and rejected attendance records will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {attendanceRecords.map((record) => (
            <div
              key={record._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">
                    {record.student?.fullName || 'Unknown Student'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Student ID: {record.student?.studentId || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {record.student?.email || 'N/A'}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    record.status === 'present'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {record.status === 'present' ? 'Present' : 'Rejected'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                <p>
                  <strong>Subject:</strong>{' '}
                  {record.session?.subject || 'N/A'}
                </p>

                <p>
                  <strong>Class:</strong>{' '}
                  {record.session?.className || 'N/A'}
                </p>

                <p>
                  <strong>Section:</strong>{' '}
                  {record.session?.section || 'N/A'}
                </p>

                <p>
                  <strong>Session Date:</strong>{' '}
                  {record.session?.sessionDate
                    ? new Date(record.session.sessionDate).toLocaleDateString()
                    : 'N/A'}
                </p>

                <p>
                  <strong>Submitted:</strong>{' '}
                  {record.submittedAt
                    ? new Date(record.submittedAt).toLocaleString()
                    : 'N/A'}
                </p>

                <p>
                  <strong>Reviewed:</strong>{' '}
                  {record.reviewedAt
                    ? new Date(record.reviewedAt).toLocaleString()
                    : 'N/A'}
                </p>

                <p>
                  <strong>Reviewed By:</strong>{' '}
                  {record.reviewedBy?.fullName || 'N/A'}
                </p>
              </div>

              {record.status === 'rejected' && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  <strong>Rejection Reason:</strong>{' '}
                  {record.rejectionReason || 'No reason provided.'}
                </div>
              )}

              {record.blockchainTxHash && (
                <div className="mt-4 break-all rounded-lg bg-violet-50 p-4 text-sm text-violet-700">
                  <strong>Blockchain Transaction:</strong>{' '}
                  {record.blockchainTxHash}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


if (activeTab === 'My Profile') {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            My Profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View your faculty account information.
          </p>
        </div>

        <button
          onClick={fetchFacultyProfile}
          disabled={profileLoading}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {profileLoading ? 'Refreshing...' : 'Refresh Profile'}
        </button>
      </div>

      {profileError && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {profileError}
        </div>
      )}

      {profileLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading faculty profile...
        </div>
      ) : facultyProfile ? (
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <UserCircle size={38} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {facultyProfile.fullName}
              </h3>
              <p className="text-sm text-slate-500">
                Faculty Member
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-1 font-semibold text-slate-800">
                {facultyProfile.fullName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="mt-1 break-all font-semibold text-slate-800">
                {facultyProfile.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Faculty ID</p>
              <p className="mt-1 font-semibold text-slate-800">
                {facultyProfile.facultyId || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Department</p>
              <p className="mt-1 font-semibold text-slate-800">
                {facultyProfile.department || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-1 font-semibold capitalize text-slate-800">
                {facultyProfile.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Registration Date</p>
              <p className="mt-1 font-semibold text-slate-800">
                {facultyProfile.createdAt
                  ? new Date(facultyProfile.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <UserCircle size={42} className="mx-auto text-violet-500" />
          <h3 className="mt-4 font-semibold text-slate-800">
            Faculty Profile
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Click Refresh Profile to load your account information.
          </p>
        </div>
      )}
    </div>
  )
}


if (activeTab === 'Overview') {
  const totalRecords = attendanceRecords.length

  const presentCount = attendanceRecords.filter(
    (record) => record.status === 'present'
  ).length

  const rejectedCount = attendanceRecords.filter(
    (record) => record.status === 'rejected'
  ).length

  const pendingCount = pendingRequests.length

  const stats = [
    {
      title: 'Total Attendance Records',
      value: totalRecords,
      icon: ClipboardList,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Present Students',
      value: presentCount,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Rejected Requests',
      value: rejectedCount,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Pending Requests',
      value: pendingCount,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Faculty Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor attendance activity and student submissions.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-800">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}

      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-slate-800">
          Recent Attendance Activity
        </h3>

        {attendanceRecords.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No attendance activity available yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {attendanceRecords.slice(0, 5).map((record) => (
              <div
                key={record._id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {record.student?.fullName || 'Unknown Student'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {record.session?.subject || 'N/A'} ·{' '}
                    {record.session?.className || 'N/A'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {record.submittedAt
                      ? new Date(record.submittedAt).toLocaleString()
                      : 'Date unavailable'}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    record.status === 'present'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {record.status === 'present' ? 'Present' : 'Rejected'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



    const descriptions = {
      Overview: 'Your faculty workspace and attendance management overview.',
      'Attendance Requests': 'Review and manage student attendance submissions.',
      'Attendance Records': 'View attendance records for your classes.',
      'My Profile': 'View your faculty account information.',
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">
          {activeTab}
        </h2>
        <p className="mt-2 text-slate-500">
          {descriptions[activeTab]}
        </p>
        <p className="mt-4 text-sm text-slate-400">
          This section will be connected to the backend in the next development steps.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-white">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="rounded-xl bg-violet-600 p-2">
            <GraduationCap size={25} />
          </div>
          <div>
            <h1 className="text-lg font-bold">CampusChain</h1>
            <p className="text-xs text-slate-400">Faculty Workspace</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.name

            return (
              <button
                key={item.name}
                onClick={() => {
  setActiveTab(item.name)
  setError('')
  setSuccess('')
  setRequestsError('')
  setRecordsError('')

if (item.name === 'Overview') {
  fetchOverviewData()
}

  if (item.name === 'Attendance Requests') {
    fetchPendingRequests()
  }

  if (item.name === 'Attendance Records') {
    fetchAttendanceRecords()
  }

  if (item.name === 'My Profile') {
  fetchFacultyProfile()
}


}}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-5 md:px-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              CampusChain Attendance Management
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <UserCircle size={18} />
            Faculty
          </div>
        </header>

        <section className="p-6 md:p-10">
          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}
          {renderContent()}
        </section>
      </main>
    </div>
  )
}

export default FacultyDashboard
