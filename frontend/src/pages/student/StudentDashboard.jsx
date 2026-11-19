
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Html5Qrcode } from 'html5-qrcode'
import {
  LayoutDashboard,
  ClipboardCheck,
  QrCode,
  User,
  LogOut,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
} from 'lucide-react'

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')

  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceError, setAttendanceError] = useState('')

  const [scannedQrData, setScannedQrData] = useState('')
  const [scannerError, setScannerError] = useState('')
  const [scannerLoading, setScannerLoading] = useState(false)

  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const student = JSON.parse(
    sessionStorage.getItem('campuschain_user') || '{}'
  )

  // Fetch student profile
  useEffect(() => {
    if (activeTab !== 'My Profile') return

    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        setProfileError('')

        const token = sessionStorage.getItem('campuschain_token')

        const response = await api.get('/profile/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setProfile(response.data.profile)
      } catch (error) {
        setProfileError(
          error.response?.data?.message ||
            'Unable to load student profile.'
        )
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [activeTab])

  // Fetch student attendance records
  useEffect(() => {
    if (
      activeTab !== 'My Attendance' &&
      activeTab !== 'Overview'
    ) {
      return
    }

    const fetchAttendanceRecords = async () => {
      try {
        setAttendanceLoading(true)
        setAttendanceError('')

        const token = sessionStorage.getItem('campuschain_token')

        const response = await api.get(
          '/attendance/student/records',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setAttendanceRecords(response.data.data || [])
      } catch (error) {
        setAttendanceError(
          error.response?.data?.message ||
            'Unable to load attendance records.'
        )
      } finally {
        setAttendanceLoading(false)
      }
    }

    fetchAttendanceRecords()
  }, [activeTab])

useEffect(() => {
  if (activeTab !== 'Scan QR Code') return

  let scanner
  let isMounted = true
  let hasProcessedQr = false
  const startScanner = async () => {
    try {
      setScannerLoading(true)
      setScannerError('')
      setScannedQrData('')

      scanner = new Html5Qrcode('student-qr-reader')

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
       async (decodedText) => {
  if (!isMounted || hasProcessedQr) return

  hasProcessedQr = true

  try {
    await scanner.stop()
  } catch (error) {
    console.log('Scanner stop:', error)
  }

  if (!isMounted) return

  await processScannedQr(decodedText)
},
        () => {}
      )
    } catch (error) {
      if (isMounted) {
        setScannerError(
          'Unable to access camera. Please allow camera permission and try again.'
        )
      }
    } finally {
      if (isMounted) {
        setScannerLoading(false)
      }
    }
  }

  startScanner()

  return () => {
    isMounted = false

    if (scanner) {
      scanner.stop()
        .then(() => scanner.clear())
        .catch(() => {})
    }
  }
}, [activeTab])


// Validate QR and submit attendance using backend APIs
const processScannedQr = async (decodedText) => {
  try {
    setScannerError('')
    setUploadError('')

    const qrData = JSON.parse(decodedText)

    if (!qrData.sessionId || !qrData.token) {
      throw new Error('Invalid QR code format.')
    }

    const authToken = sessionStorage.getItem('campuschain_token')

    if (!authToken) {
      throw new Error('Your login session has expired. Please log in again.')
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
    }

    // Step 1: Validate QR code
    const validationResponse = await api.post(
      '/attendance/validate',
      {
        sessionId: qrData.sessionId,
        token: qrData.token,
      },
      { headers }
    )

    if (!validationResponse.data.success) {
      throw new Error(
        validationResponse.data.message || 'QR validation failed.'
      )
    }

    // Step 2: Submit attendance request
    const submissionResponse = await api.post(
      '/attendance/submit',
      {
        sessionId: qrData.sessionId,
        token: qrData.token,
      },
      { headers }
    )

    if (!submissionResponse.data.success) {
      throw new Error(
        submissionResponse.data.message || 'Attendance submission failed.'
      )
    }

    setScannedQrData(
      JSON.stringify({
        success: true,
        message: submissionResponse.data.message,
        subject: validationResponse.data.data.subject,
        className: validationResponse.data.data.className,
        section: validationResponse.data.data.section,
      })
    )

  } catch (error) {
    console.error('QR attendance error:', error)

    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to process QR attendance.'

    setScannerError(message)
    setUploadError(message)
  }
}


// Handle QR code image upload from gallery
const handleQrImageUpload = async (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  setUploadLoading(true)
  setUploadError('')
  setScannedQrData('')

  let fileScanner

  try {
    fileScanner = new Html5Qrcode('student-qr-file-reader')

    const decodedText = await fileScanner.scanFile(file, false)

    await processScannedQr(decodedText)
  } catch (error) {
    console.error('QR image scanning error:', error)

    setUploadError(
      'No QR code found in this image. Please upload a clear QR code image.'
    )
  } finally {
    if (fileScanner) {
      try {
        await fileScanner.clear()
      } catch (error) {
        console.log('QR image scanner cleanup:', error)
      }
    }

    setUploadLoading(false)
    event.target.value = ''
  }
}

  // Sidebar menu items
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Attendance', icon: ClipboardCheck },
    { name: 'Scan QR Code', icon: QrCode },
    { name: 'My Profile', icon: User },
  ]

  // Attendance calculations
  const presentCount = attendanceRecords.filter(
    (record) => record.status === 'present'
  ).length

  const absentCount = attendanceRecords.filter(
    (record) => record.status === 'absent'
  ).length

  const pendingCount = attendanceRecords.filter(
    (record) => record.status === 'pending'
  ).length

  const rejectedCount = attendanceRecords.filter(
    (record) => record.status === 'rejected'
  ).length

  const totalFinalized = presentCount + absentCount

  const attendancePercentage =
    totalFinalized > 0
      ? Math.round((presentCount / totalFinalized) * 100)
      : null

  // Dashboard statistics
  const stats = [
    {
      title: 'Attendance',
      value:
        attendancePercentage !== null
          ? `${attendancePercentage}%`
          : 'N/A',
      subtitle: 'Based on finalized records',
      icon: CheckCircle2,
    },
    {
      title: 'Classes Attended',
      value: presentCount,
      subtitle: 'Total approved classes',
      icon: BookOpen,
    },
    {
      title: 'Classes Missed',
      value: absentCount,
      subtitle: 'Total marked absent',
      icon: XCircle,
    },
    {
      title: 'Pending Requests',
      value: pendingCount,
      subtitle: 'Awaiting approval',
      icon: Clock,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* Sidebar */}
      <aside className="w-full bg-slate-950 text-white md:min-h-screen md:w-64">

        <div className="border-b border-white/10 px-6 py-6">
          <h1 className="text-2xl font-bold">
            Campus<span className="text-violet-400">Chain</span>
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Student Workspace
          </p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === item.name
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4 md:mt-8">
          <button
            onClick={() => {
              sessionStorage.removeItem('campuschain_token')
              sessionStorage.removeItem('campuschain_user')
              window.location.href = '/login'
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 sm:p-8">

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm font-medium text-violet-600">
              STUDENT PORTAL
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {activeTab}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Welcome back, {student.fullName || 'Student'}!
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <GraduationCap size={25} />
          </div>

        </header>

        {/* Overview Section */}
        {activeTab === 'Overview' && (
          <>

            {/* Statistics Cards */}
            <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {stats.map((stat) => {
                const Icon = stat.icon

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <Icon
                        className="text-violet-600"
                        size={22}
                      />
                    </div>

                    <h3 className="mt-4 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      {stat.subtitle}
                    </p>
                  </div>
                )
              })}

            </section>

            {/* Overview Cards */}
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* Attendance Overview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="text-violet-600"
                    size={22}
                  />

                  <h3 className="font-bold text-slate-900">
                    Attendance Overview
                  </h3>
                </div>

                {attendanceLoading ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Loading attendance overview...
                  </p>
                ) : attendanceError ? (
                  <p className="mt-4 text-sm text-red-600">
                    {attendanceError}
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Approved classes
                      </span>

                      <span className="font-semibold text-green-600">
                        {presentCount}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Rejected requests
                      </span>

                      <span className="font-semibold text-red-600">
                        {rejectedCount}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Pending requests
                      </span>

                      <span className="font-semibold text-amber-600">
                        {pendingCount}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500">
                        Overall attendance
                      </p>

                      <p className="mt-1 text-2xl font-bold text-violet-700">
                        {attendancePercentage !== null
                          ? `${attendancePercentage}%`
                          : 'N/A'}
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div className="flex items-center gap-3">
                  <Clock
                    className="text-violet-600"
                    size={22}
                  />

                  <h3 className="font-bold text-slate-900">
                    Recent Activity
                  </h3>
                </div>

                {attendanceLoading ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Loading recent activity...
                  </p>
                ) : attendanceError ? (
                  <p className="mt-4 text-sm text-red-600">
                    {attendanceError}
                  </p>
                ) : attendanceRecords.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    No attendance activity available yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {attendanceRecords.slice(0, 4).map((record) => (
                      <div
                        key={record._id}
                        className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800">
                            {record.session?.subject || 'Attendance Request'}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.session?.className || 'Class'}
                            {record.session?.section
                              ? ` • Section ${record.session.section}`
                              : ''}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {record.submittedAt
                              ? new Date(record.submittedAt).toLocaleString()
                              : 'Date unavailable'}
                          </p>

                          {record.rejectionReason && (
                            <p className="mt-2 text-xs text-red-500">
                              Reason: {record.rejectionReason}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : record.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </section>

          </>
        )}

        {/* My Attendance Section */}
        {activeTab === 'My Attendance' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Attendance History
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View your attendance records and request status.
                </p>
              </div>

              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                {attendanceRecords.length} Records
              </span>
            </div>

            {attendanceLoading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading attendance records...
              </p>
            ) : attendanceError ? (
              <p className="py-8 text-center text-sm text-red-600">
                {attendanceError}
              </p>
            ) : attendanceRecords.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
                <ClipboardCheck
                  size={36}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-3 font-semibold text-slate-700">
                  No attendance records found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your attendance history will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-4 font-semibold">
                        Subject
                      </th>

                      <th className="px-4 py-4 font-semibold">
                        Class
                      </th>

                      <th className="px-4 py-4 font-semibold">
                        Attendance Date
                      </th>

                      <th className="px-4 py-4 font-semibold">
                        Submitted On
                      </th>

                      <th className="px-4 py-4 font-semibold">
                        Status
                      </th>

                 <th className="px-4 py-4 font-semibold">
                Blockchain Transaction
              </th>

             </tr>
                  </thead>

                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800">
                            {record.session?.subject || 'N/A'}
                          </p>

                          {record.rejectionReason && (
                            <p className="mt-1 max-w-xs text-xs text-red-500">
                              Reason: {record.rejectionReason}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          <p>
                            {record.session?.className || 'N/A'}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {record.session?.section
                              ? `Section ${record.session.section}`
                              : ''}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {record.session?.sessionDate
                            ? new Date(
                                record.session.sessionDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {record.submittedAt
                            ? new Date(
                                record.submittedAt
                              ).toLocaleString()
                            : 'N/A'}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-700'
                                : record.status === 'absent'
                                ? 'bg-slate-100 text-slate-700'
                                : record.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                           {record.status}
</span>
</td>

{/* Blockchain Transaction */}
<td className="px-4 py-4 text-sm">
  {record.blockchainTxHash ? (
    <div className="max-w-xs">
      <p className="font-semibold text-violet-700">
        Blockchain Verified
      </p>
      <p className="mt-1 break-all text-xs text-slate-500">
        {record.blockchainTxHash}
      </p>
    </div>
  ) : (
    <span className="text-slate-400">
      Not available
    </span>
  )}
</td>

</tr>
    ))}
            </tbody>

                </table>
              </div>
            )}

          </section>
        )}

       {/* Scan QR Code Section */}
{activeTab === 'Scan QR Code' && (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

    <div className="mx-auto max-w-xl text-center">

      <QrCode
        size={42}
        className="mx-auto text-violet-600"
      />

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        Scan Attendance QR Code
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Position the faculty-generated QR code inside the scanning area.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div
          id="student-qr-reader"
          className="mx-auto w-full max-w-sm"
        />
      </div>

      {/* Off-screen container used by html5-qrcode to decode gallery images */}
      <div
        id="student-qr-file-reader"
        className="fixed -left-[10000px] top-0 h-[320px] w-[320px] overflow-hidden"
        aria-hidden="true"
      />

      <div className="mt-6 border-t border-slate-200 pt-6">
        <p className="text-sm font-semibold text-slate-700">
          Or upload a QR code image
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Choose a saved QR code image from your phone or computer.
        </p>

        <label
          htmlFor="student-qr-image-upload"
          className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          {uploadLoading ? 'Reading image...' : 'Choose Image from Gallery'}
        </label>
        <input
          id="student-qr-image-upload"
          type="file"
          accept="image/*"
          onChange={handleQrImageUpload}
          className="hidden"
          disabled={uploadLoading}
        />
      </div>

      {uploadLoading && (
        <p className="mt-3 text-sm text-violet-600">
          Checking the selected image for a QR code...
        </p>
      )}

      {uploadError && (
        <p className="mt-3 text-sm text-red-600">{uploadError}</p>
      )}

      {scannerLoading && (
        <p className="mt-4 text-sm text-violet-600">
          Starting camera...
        </p>
      )}

      {scannerError && (
        <p className="mt-4 text-sm text-red-600">
          {scannerError}
        </p>
      )}

      {scannedQrData && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left">

          <p className="font-semibold text-green-800">
            QR Code Scanned Successfully
          </p>

          <p className="mt-2 break-all text-sm text-green-700">
            {scannedQrData}
          </p>

          <p className="mt-3 text-xs text-green-700">
            QR content captured. Attendance validation will be connected next.
          </p>

        </div>
      )}

    </div>
  </section>
)}
        {/* Student Profile Section */}
        {activeTab === 'My Profile' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-slate-900">
              Student Information
            </h3>

            {profileLoading && (
              <p className="mt-5 text-sm text-slate-500">
                Loading your profile...
              </p>
            )}

            {profileError && (
              <p className="mt-5 text-sm text-red-600">
                {profileError}
              </p>
            )}

            {profile && !profileLoading && (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Student ID
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.studentId || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Department
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.department || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Role
                  </p>

                  <p className="mt-1 font-semibold capitalize text-slate-900">
                    {profile.role}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Registered On
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : 'Not available'}
                  </p>
                </div>

              </div>
            )}

          </section>
        )}

      </main>
    </div>
  )
}

export default StudentDashboard
