
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  Blocks,
  LogOut,
  UserCircle,
  UserCheck,
  ShieldCheck,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Attendance Monitoring state
const [attendanceRecords, setAttendanceRecords] = useState([])
const [attendanceLoading, setAttendanceLoading] = useState(false)
const [attendanceError, setAttendanceError] = useState('')
const [attendanceSearch, setAttendanceSearch] = useState('')
const [attendanceFilter, setAttendanceFilter] = useState('All')

// Blockchain Monitoring state
const [blockchainData, setBlockchainData] = useState(null)
const [blockchainLoading, setBlockchainLoading] = useState(false)
const [blockchainError, setBlockchainError] = useState('')

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'User Management', icon: Users },
    { name: 'Student Management', icon: GraduationCap },
    { name: 'Attendance Monitoring', icon: ClipboardList },
    { name: 'Blockchain Monitoring', icon: Blocks },
  ]

  // Fetch Admin Overview
  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError('')

      const token = sessionStorage.getItem('campuschain_token')

      if (!token) {
        throw new Error('Please log in as Administrator.')
      }

      const response = await fetch(
        'http://localhost:5000/api/admin/overview',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load dashboard.')
      }

      setStats(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError('')

      const token = sessionStorage.getItem('campuschain_token')

      if (!token) {
        throw new Error('Please log in as Administrator.')
      }

      const response = await fetch(
        'http://localhost:5000/api/admin/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load users.')
      }

      setUsers(result.data)
    } catch (err) {
      setUsersError(err.message)
    } finally {
      setUsersLoading(false)
    }
  }

// Fetch Attendance Records
const fetchAttendance = async () => {
  try {
    setAttendanceLoading(true)
    setAttendanceError('')

    const token = sessionStorage.getItem('campuschain_token')

    if (!token) {
      throw new Error('Please log in as Administrator.')
    }

    const response = await fetch(
      'http://localhost:5000/api/admin/attendance',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Unable to load attendance records.')
    }

    setAttendanceRecords(result.data || [])
  } catch (err) {
    setAttendanceError(err.message)
  } finally {
    setAttendanceLoading(false)
  }
}


// Fetch Blockchain Monitoring Records
const fetchBlockchain = async () => {
  try {
    setBlockchainLoading(true)
    setBlockchainError('')

    const token = sessionStorage.getItem('campuschain_token')

    if (!token) {
      throw new Error('Please log in as Administrator.')
    }

    const response = await fetch(
      'http://localhost:5000/api/admin/blockchain',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(
        result.message || 'Unable to load blockchain records.'
      )
    }

    setBlockchainData(result.data)
  } catch (err) {
    setBlockchainError(err.message)
  } finally {
    setBlockchainLoading(false)
  }
}


  // Load Overview when dashboard opens
  useEffect(() => {
    fetchOverview()
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('campuschain_token')
    sessionStorage.removeItem('campuschain_user')
    navigate('/login')
  }

  // Overview cards
  const statCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.users.total,
          detail: `${stats.users.active} active users`,
          icon: Users,
          color: 'bg-blue-100 text-blue-600',
        },
        {
          title: 'Total Students',
          value: stats.users.students,
          detail: 'Registered students',
          icon: GraduationCap,
          color: 'bg-violet-100 text-violet-600',
        },
        {
          title: 'Faculty Members',
          value: stats.users.faculty,
          detail: 'Registered faculty',
          icon: UserCheck,
          color: 'bg-emerald-100 text-emerald-600',
        },
        {
          title: 'Attendance Records',
          value: stats.attendance.total,
          detail: `${stats.attendance.pending} pending requests`,
          icon: ClipboardList,
          color: 'bg-orange-100 text-orange-600',
        },
        {
          title: 'Blockchain Verified',
          value: stats.blockchain.verifiedRecords,
          detail: 'Verified attendance records',
          icon: ShieldCheck,
          color: 'bg-cyan-100 text-cyan-600',
        },
        {
          title: 'Active Sessions',
          value: stats.sessions.active,
          detail: `${stats.sessions.total} total sessions`,
          icon: Activity,
          color: 'bg-pink-100 text-pink-600',
        },
      ]
    : []

   // Search and filter attendance records
  const filteredAttendance = attendanceRecords.filter((record) => {
    const search = attendanceSearch.toLowerCase()

    const matchesSearch =
      (record.student?.fullName || '').toLowerCase().includes(search) ||
      (record.student?.studentId || '').toLowerCase().includes(search) ||
      (record.session?.subject || '').toLowerCase().includes(search) ||
      (record.session?.className || '').toLowerCase().includes(search)

    const matchesStatus =
      attendanceFilter === 'All' ||
      record.status === attendanceFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })


// Search and filter users
const filteredUsers = users.filter((user) => {
  const search = searchTerm.toLowerCase()

  const matchesSearch =
    (user.fullName || '').toLowerCase().includes(search) ||
    (user.email || '').toLowerCase().includes(search)

  const matchesRole =
    roleFilter === 'All' || user.role === roleFilter

  const matchesStatus =
    statusFilter === 'All' ||
    (statusFilter === 'Active' && user.isActive) ||
    (statusFilter === 'Inactive' && !user.isActive)

  return matchesSearch && matchesRole && matchesStatus
})

  return (
    <div className="flex min-h-screen bg-slate-100">


      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-white">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="rounded-xl bg-violet-600 p-2">
            <GraduationCap size={25} />
          </div>

          <div>
            <h1 className="text-lg font-bold">CampusChain</h1>
            <p className="text-xs text-slate-400">Admin Workspace</p>
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

                if (
                  item.name === 'User Management' ||
                  item.name === 'Student Management'
                ) {
                  fetchUsers()
                }

                if (item.name === 'Attendance Monitoring') {
                  fetchAttendance()
                }
                if (item.name === 'Blockchain Monitoring') {
                  fetchBlockchain()
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

      {/* Main Dashboard */}
      <main className="min-w-0 flex-1">

        {/* Header */}
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
            Administrator
          </div>
        </header>

        <section className="p-6 md:p-10">

          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'Overview' ? 'Admin Overview' : activeTab}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor the CampusChain system.
              </p>
            </div>

            {activeTab === 'Overview' && (
              <button
                onClick={fetchOverview}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            )}
          </div>

          {/* OVERVIEW SECTION */}
          {activeTab === 'Overview' ? (
            <div className="mt-7">

              {loading && (
                <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
                  Loading dashboard statistics...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && stats && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {statCards.map((card) => {
                      const Icon = card.icon

                      return (
                        <div
                          key={card.title}
                          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-500">
                                {card.title}
                              </p>

                              <h3 className="mt-3 text-3xl font-bold text-slate-800">
                                {card.value}
                              </h3>
                            </div>

                            <div className={`rounded-xl p-3 ${card.color}`}>
                              <Icon size={25} />
                            </div>
                          </div>

                          <p className="mt-4 text-xs text-slate-500">
                            {card.detail}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* Attendance Summary */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800">
                        Attendance Summary
                      </h3>

                      <div className="mt-5 space-y-4">
                        {[
                          {
                            label: 'Present',
                            value: stats.attendance.present,
                            color: 'bg-emerald-500',
                          },
                          {
                            label: 'Pending',
                            value: stats.attendance.pending,
                            color: 'bg-orange-500',
                          },
                          {
                            label: 'Rejected',
                            value: stats.attendance.rejected,
                            color: 'bg-red-500',
                          },
                          {
                            label: 'Absent',
                            value: stats.attendance.absent,
                            color: 'bg-slate-500',
                          },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="mb-2 flex justify-between text-sm">
                              <span className="text-slate-600">
                                {item.label}
                              </span>

                              <span className="font-semibold text-slate-800">
                                {item.value}
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{
                                  width: `${
                                    stats.attendance.total
                                      ? (item.value / stats.attendance.total) * 100
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800">
                        System Information
                      </h3>

                      <div className="mt-5 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <span className="text-sm text-slate-500">
                            Total Administrators
                          </span>

                          <span className="font-semibold text-slate-800">
                            {stats.users.admins}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <span className="text-sm text-slate-500">
                            Inactive Users
                          </span>

                          <span className="font-semibold text-slate-800">
                            {stats.users.inactive}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <span className="text-sm text-slate-500">
                            Total Sessions
                          </span>

                          <span className="font-semibold text-slate-800">
                            {stats.sessions.total}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            Blockchain Records
                          </span>

                          <span className="font-semibold text-emerald-600">
                            {stats.blockchain.verifiedRecords} verified
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>

          ) : activeTab === 'User Management' ? (

            /* USER MANAGEMENT SECTION */
            <div className="mt-7 space-y-6">

              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-w-[220px] flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="All">All Roles</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <button
                  onClick={fetchUsers}
                  disabled={usersLoading}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  Refresh Users
                </button>
              </div>

              {/* User Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-5">
                  <h3 className="text-lg font-bold text-slate-800">
                    Registered Users
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Total users: {filteredUsers.length}
                  </p>
                </div>

                {usersLoading ? (
                  <p className="p-8 text-center text-slate-500">
                    Loading users...
                  </p>
                ) : usersError ? (
                  <p className="p-8 text-center text-red-600">
                    {usersError}
                  </p>
                ) : filteredUsers.length === 0 ? (
                  <p className="p-8 text-center text-slate-500">
                    No users found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">

                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Name</th>
                          <th className="px-5 py-4">Email</th>
                          <th className="px-5 py-4">Role</th>
                          <th className="px-5 py-4">ID</th>
                          <th className="px-5 py-4">Department</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Joined</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-50">

                            <td className="px-5 py-4 font-medium text-slate-800">
                              {user.fullName}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {user.email}
                            </td>

                            <td className="px-5 py-4 capitalize text-slate-600">
                              {user.role}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {user.studentId || user.facultyId || '—'}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {user.department || '—'}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  user.isActive
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}
              </div>
            </div>


) : activeTab === 'Student Management' ? (
  <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100">
      <h2 className="text-xl font-bold text-slate-900">
        Registered Students
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Manage and monitor registered student accounts.
      </p>
    </div>

    {usersLoading ? (
      <p className="p-6 text-slate-500">Loading students...</p>
    ) : usersError ? (
      <p className="p-6 text-red-500">{usersError}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(user => user.role === 'student').map(user => (
              <tr key={user._id} className="border-t border-slate-100">
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.studentId || '—'}</td>
                <td className="p-4">{user.department || '—'}</td>
                <td className="p-4">
                  {user.isActive ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
) : activeTab === 'Attendance Monitoring' ? (
  <div className="mt-7 space-y-6">

    {/* Attendance Summary */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {[
        {
          title: 'Total Records',
          value: attendanceRecords.length,
          color: 'text-blue-600',
        },
        {
          title: 'Present',
          value: attendanceRecords.filter(r => r.status === 'present').length,
          color: 'text-emerald-600',
        },
        {
          title: 'Pending',
          value: attendanceRecords.filter(r => r.status === 'pending').length,
          color: 'text-orange-600',
        },
        {
          title: 'Rejected',
          value: attendanceRecords.filter(r => r.status === 'rejected').length,
          color: 'text-red-600',
        },
      ].map((item) => (
        <div key={item.title} className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{item.title}</p>
          <h3 className={`mt-2 text-3xl font-bold ${item.color}`}>
            {item.value}
          </h3>
        </div>
      ))}
    </div>

    {/* Search and Filter */}
    <div className="flex flex-wrap gap-4 rounded-2xl border bg-white p-5 shadow-sm">
      <input
        type="text"
        placeholder="Search student, ID, subject or class..."
        value={attendanceSearch}
        onChange={(e) => setAttendanceSearch(e.target.value)}
        className="min-w-[220px] flex-1 rounded-xl border px-4 py-3 text-sm"
      />

      <select
        value={attendanceFilter}
        onChange={(e) => setAttendanceFilter(e.target.value)}
        className="rounded-xl border px-4 py-3 text-sm"
      >
        <option value="All">All Status</option>
        <option value="Present">Present</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
        <option value="Absent">Absent</option>
      </select>

      <button
        onClick={fetchAttendance}
        disabled={attendanceLoading}
        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700"
      >
        Refresh Records
      </button>
    </div>

    {/* Attendance Records */}
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h3 className="text-lg font-bold text-slate-800">
          Attendance Records
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Total records: {filteredAttendance.length}
        </p>
      </div>

      {attendanceLoading ? (
        <p className="p-8 text-center text-slate-500">
          Loading attendance records...
        </p>
      ) : attendanceError ? (
        <p className="p-8 text-center text-red-600">
          {attendanceError}
        </p>
      ) : filteredAttendance.length === 0 ? (
        <p className="p-8 text-center text-slate-500">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Student ID</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Blockchain</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {record.student?.fullName || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {record.student?.studentId || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {record.session?.subject || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {record.session?.className || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {record.session?.sessionDate
                      ? new Date(record.session.sessionDate).toLocaleDateString()
                      : '—'}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                      {record.status || 'Unknown'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                  {record.blockchainVerification?.verified
                  ? 'Verified'
                  : record.blockchainTxHash
                    ? 'Unverified'
                    : 'Not recorded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
) : activeTab === 'Blockchain Monitoring' ? (
  <div className="mt-7 space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Blockchain Monitoring
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor attendance records and blockchain transactions.
        </p>
      </div>

      <button
        onClick={fetchBlockchain}
        disabled={blockchainLoading}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>

    {/* Loading */}
    {blockchainLoading && (
      <p className="rounded-xl bg-blue-50 p-4 text-blue-700">
        Loading blockchain records...
      </p>
    )}

    {/* Error */}
    {blockchainError && (
      <p className="rounded-xl bg-red-50 p-4 text-red-600">
        {blockchainError}
      </p>
    )}


    {/* Summary Cards */}
    {blockchainData && (
      <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Attendance</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {blockchainData.totalAttendance}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Transactions Recorded</p>
            <h3 className="mt-2 text-3xl font-bold text-blue-600">
              {blockchainData.totalTransactions}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Verified Transactions</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {blockchainData.verifiedTransactions}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Unverified Transactions</p>
            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {blockchainData.unverifiedTransactions}
            </h3>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Without Transaction</p>
            <h3 className="mt-2 text-3xl font-bold text-orange-500">
              {blockchainData.recordsWithoutTransaction}
            </h3>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h3 className="text-lg font-bold text-slate-800">
              Blockchain Transaction Records
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Attendance records and their on-chain verification status.
            </p>
          </div>

          {blockchainData.transactions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Blockchain Verification</th>
                    <th className="p-4">Transaction Hash</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {blockchainData.transactions.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {record.student?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {record.student?.studentId || ''}
                        </p>
                      </td>

                      <td className="p-4">
                        {record.session?.subject || 'N/A'}
                      </td>

                      <td className="p-4">
                        {record.session?.className || 'N/A'}
                      </td>

                      <td className="p-4">
                        {record.session?.sessionDate
                          ? new Date(record.session.sessionDate).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {record.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {record.blockchainVerification?.verified ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="max-w-xs break-all p-4 font-mono text-xs text-blue-600">
                        {record.blockchainTxHash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-slate-500">
              No blockchain transactions recorded yet.
            </p>
          )}
        </div>
      </>
    )}
  </div>

) : (
  <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <p className="text-slate-600">
      {activeTab} section will be implemented here.
    </p>
  </div>
)}
</section>
</main>
</div>
)
}

export default AdminDashboard
