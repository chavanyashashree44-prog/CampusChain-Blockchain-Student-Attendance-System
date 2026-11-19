
import { useState } from 'react'
import {
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Brand */}
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              CampusChain
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">
              SMART ATTENDANCE
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="/login"
            className="text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
          >
            Sign in
          </a>

          <a
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Get Started
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600"
              >
                {link.label}
              </a>
            ))}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <a
                href="/login"
                className="text-sm font-semibold text-slate-700"
              >
                Sign in
              </a>

              <a
                href="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Get Started
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
