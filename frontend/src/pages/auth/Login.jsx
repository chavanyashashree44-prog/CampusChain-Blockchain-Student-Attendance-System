
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  Shield,
} from 'lucide-react'

import api from '../../services/api'

function Login() {
  const navigate = useNavigate()


  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('Student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    { name: 'Student', icon: GraduationCap },
    { name: 'Faculty', icon: Users },
    { name: 'Admin', icon: Shield },
  ]

  // Authenticate user through backend API
  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (isLoading) return

    try {
      setIsLoading(true)

      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      })

      const { token, user } = response.data

      // Verify selected role matches the authenticated account
      if (user.role !== role.toLowerCase()) {
        setMessageType('error')
        setMessage(
          `This account belongs to ${user.role}. Please select the correct role and try again.`
        )
        return
      }

      // Store authentication details for this browser session
      sessionStorage.setItem('campuschain_token', token)
      sessionStorage.setItem(
        'campuschain_user',
        JSON.stringify(user)
      )

     setMessageType('success')
setMessage(
  `Welcome, ${user.fullName}! Your ${user.role} login was successful.`
)

setPassword('')

if (user.role === 'student') {
  navigate('/student/dashboard')
} else if (user.role === 'faculty') {
  navigate('/faculty/dashboard')
} else if (user.role === 'admin') {
  navigate('/admin/dashboard')
}

    } catch (error) {
      console.error('Login error:', error)

      setMessageType('error')
      setMessage(
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'The request timed out. Please try again.'
          : 'Unable to connect to the server. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* Left branding panel */}
      <div className="relative hidden overflow-hidden bg-slate-950 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">

        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <a href="/" className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold">CampusChain</h1>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
              SMART ATTENDANCE
            </p>
          </div>
        </a>

        <div className="relative max-w-lg">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-semibold text-indigo-300">
            <ShieldCheck size={15} />
            SECURE ACCESS PORTAL
          </div>

          <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            Attendance you can
            <span className="block text-indigo-400">
              trust and verify.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Access your attendance workspace through a
            secure platform designed for students, faculty
            and administrators.
          </p>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <LockKeyhole size={23} />
              </div>

              <div>
                <h3 className="font-bold">Protected Access</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Role-based access and verified records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} CampusChain. All rights reserved.
        </p>
      </div>

      {/* Login form */}
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">

        <div className="w-full max-w-md">

          <a
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to homepage
          </a>

          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ShieldCheck size={25} />
              </div>

              <span className="text-xl font-extrabold text-slate-900">
                CampusChain
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-600">
              WELCOME BACK
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Sign in to your
              <span className="block text-indigo-600">
                account.
              </span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your credentials to access your CampusChain workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">

            {/* Role selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Sign in as
              </label>

              <div className="grid grid-cols-3 gap-3">
                {roles.map((item) => {
                  const Icon = item.icon
                  const selected = role === item.name

                  return (
                    <button
                      key={item.name}
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setRole(item.name)
                        setMessage('')
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-semibold transition ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'
                      }`}
                    >
                      <Icon size={21} />
                      {item.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                <Mail size={19} className="shrink-0 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setMessage('')
                  }}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <a
                  href="#forgot-password"
                  onClick={(event) => event.preventDefault()}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </a>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
                <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setMessage('')
                  }}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 transition hover:text-indigo-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* API response message */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-3 text-sm leading-6 ${
                  messageType === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Create account
            </a>
          </p>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Secure CampusChain access
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
