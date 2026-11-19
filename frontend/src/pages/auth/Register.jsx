
import { useState } from 'react'
import {
  ShieldCheck,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  CheckCircle2,
} from 'lucide-react'

import api from '../../services/api'

function Register() {
  const [role, setRole] = useState('Student')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    identifier: '',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setMessage('')
  }

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole)

    setFormData((previous) => ({
      ...previous,
      identifier: '',
    }))

    setMessage('')
  }

  // Register student or faculty through backend API
  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (isLoading) return

    if (formData.password.length < 8) {
      setMessageType('error')
      setMessage('Password must contain at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessageType('error')
      setMessage('Passwords do not match. Please check again.')
      return
    }

    if (!formData.identifier.trim()) {
      setMessageType('error')
      setMessage(
        `Please enter your ${role === 'Student' ? 'Student ID' : 'Faculty ID'}.`
      )
      return
    }

    const registrationData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: role.toLowerCase(),

      ...(role === 'Student'
        ? { studentId: formData.identifier.trim() }
        : { facultyId: formData.identifier.trim() }),
    }

    try {
      setIsLoading(true)

      const response = await api.post(
        '/auth/register',
        registrationData
      )

      setMessageType('success')
      setMessage(
        response.data.message ||
        'Account registered successfully! You can now sign in.'
      )

      setFormData({
        fullName: '',
        email: '',
        identifier: '',
        password: '',
        confirmPassword: '',
      })

      setRole('Student')
    } catch (error) {
      console.error('Registration error:', error)

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

  const inputClass =
    'w-full bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400'

  const fieldClass =
    'flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'

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
            JOIN CAMPUSCHAIN
          </div>

          <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            Build a smarter
            <span className="block text-indigo-400">
              attendance experience.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Create your account and access a structured
            attendance platform built for students and
            faculty members.
          </p>

          <div className="mt-12 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <CheckCircle2 size={21} />
              </div>
              <span className="text-sm font-medium text-slate-200">
                Secure account access
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <GraduationCap size={21} />
              </div>
              <span className="text-sm font-medium text-slate-200">
                Dedicated student and faculty accounts
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <ShieldCheck size={21} />
              </div>
              <span className="text-sm font-medium text-slate-200">
                Transparent attendance management
              </span>
            </div>

          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} CampusChain. All rights reserved.
        </p>
      </div>

      {/* Registration form */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">

        <div className="w-full max-w-md">

          <a
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to homepage
          </a>

          <div className="mb-7 lg:hidden">
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
              CREATE ACCOUNT
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Join CampusChain
              <span className="block text-indigo-600">
                today.
              </span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create your account to get started with smarter attendance management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Role selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Register as
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => handleRoleChange('Student')}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-semibold transition ${
                    role === 'Student'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  <GraduationCap size={20} />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('Faculty')}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-semibold transition ${
                    role === 'Faculty'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  <Users size={20} />
                  Faculty
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Administrator accounts are created through authorized administration.
              </p>
            </div>

            {/* Full name */}
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>

              <div className={fieldClass}>
                <UserRound size={19} className="shrink-0 text-slate-400" />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className={fieldClass}>
                <Mail size={19} className="shrink-0 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Student / Faculty ID */}
            <div>
              <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-slate-700">
                {role === 'Student' ? 'Student ID' : 'Faculty ID'}
              </label>

              <div className={fieldClass}>
                <ShieldCheck size={19} className="shrink-0 text-slate-400" />

                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder={
                    role === 'Student'
                      ? 'Enter your student ID'
                      : 'Enter your faculty ID'
                  }
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className={fieldClass}>
                <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={inputClass}
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

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm password
              </label>

              <div className={fieldClass}>
                <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 transition hover:text-indigo-600"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                  }
                </button>
              </div>
            </div>

            {/* Validation and API response message */}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={18} />}
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-bold text-indigo-600 transition hover:text-indigo-700"
            >
              Sign in
            </a>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Secure CampusChain registration
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register
