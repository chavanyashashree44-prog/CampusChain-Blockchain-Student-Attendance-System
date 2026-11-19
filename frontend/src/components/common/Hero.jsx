
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  LockKeyhole,
  Users,
  TrendingUp,
} from 'lucide-react'

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

        {/* Left Content */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">
            <ShieldCheck size={16} className="text-indigo-600" />
            <span className="text-xs font-semibold tracking-wide text-indigo-700">
              BLOCKCHAIN-SECURED ATTENDANCE
            </span>
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-[58px]">
            Attendance
            <span className="block">Management,</span>
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-500 sm:text-lg">
            Experience smarter student attendance with QR-based
            verification and blockchain-backed records.
            Transparent, reliable and designed for modern education.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight size={18} />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              Explore How It Works
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={17} className="text-emerald-500" />
              QR-based attendance
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Secure records
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Transparent verification
            </div>
          </div>
        </div>

        {/* Right Dashboard Preview */}
        <div className="relative mx-auto w-full max-w-[530px]">

          {/* Decorative background */}
          <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-br from-indigo-100 to-violet-100 opacity-70 blur-xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70 sm:p-7">

            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  CAMPUSCHAIN OVERVIEW
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Attendance Dashboard
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={23} />
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <Users size={19} className="text-indigo-600" />
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <p className="mt-5 text-xs font-medium text-slate-500">
                  Total Students
                </p>
                <h4 className="mt-1 text-2xl font-bold text-slate-900">
                  1,248
                </h4>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <p className="mt-5 text-xs font-medium text-slate-500">
                  Attendance Rate
                </p>
                <h4 className="mt-1 text-2xl font-bold text-slate-900">
                  87.5%
                </h4>
              </div>
            </div>

            {/* Attendance Progress */}
            <div className="mt-6 rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">
                  Today's Attendance
                </h4>
                <span className="text-xs text-slate-400">
                  Preview
                </span>
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      'conic-gradient(#4f46e5 0% 87.5%, #e2e8f0 87.5% 100%)',
                  }}
                >
                  <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-xl font-extrabold text-slate-900">
                      87.5%
                    </span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">Present</span>
                      <span className="font-bold text-slate-800">1,092</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[87.5%] rounded-full bg-indigo-600" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">Absent</span>
                      <span className="font-bold text-slate-800">156</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[12.5%] rounded-full bg-rose-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Status */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <LockKeyhole size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold">
                  Blockchain Verification
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Smart contract integration preview
                </p>
              </div>

              <ShieldCheck size={22} className="shrink-0 text-emerald-400" />
            </div>
          </div>

          {/* QR Floating Element */}
          <div className="absolute -right-4 top-16 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <QrCode size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Quick Attendance
              </p>
              <p className="text-[10px] text-slate-400">
                QR-based workflow
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
