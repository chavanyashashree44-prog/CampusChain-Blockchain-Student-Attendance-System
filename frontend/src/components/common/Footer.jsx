import {
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <ShieldCheck size={23} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                CampusChain
              </span>
            </a>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Making student attendance more transparent,
              structured and verifiable through blockchain technology.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Explore
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
                <a href="#about" className="transition hover:text-indigo-600">About</a>
                <a href="#features" className="transition hover:text-indigo-600">Features</a>
                <a href="#how-it-works" className="transition hover:text-indigo-600">How It Works</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Account
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
                <a href="/login" className="transition hover:text-indigo-600">Sign in</a>
                <a href="/register" className="transition hover:text-indigo-600">Create account</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-slate-100 pt-7 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} CampusChain. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with transparency and trust
            <ArrowUpRight size={13} />
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer