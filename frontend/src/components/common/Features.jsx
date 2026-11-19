
import {
  QrCode,
  ShieldCheck,
  ChartNoAxesCombined,
  Users,
  LockKeyhole,
  Clock3,
} from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'Smart QR Attendance',
    description:
      'Generate dynamic QR codes for attendance sessions and make student check-ins simple and efficient.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: ShieldCheck,
    title: 'Blockchain Security',
    description:
      'Store attendance verification records through smart contracts to provide tamper-evident tracking.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Attendance Analytics',
    description:
      'Explore attendance trends, subject-wise statistics and detailed reports through interactive dashboards.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description:
      'Dedicated experiences for administrators, faculty members and students with appropriate permissions.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: LockKeyhole,
    title: 'Verified Records',
    description:
      'Maintain verifiable attendance history with blockchain transaction references and audit information.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Clock3,
    title: 'Real-Time Tracking',
    description:
      'Monitor attendance sessions and access updated attendance information through the application.',
    color: 'bg-rose-50 text-rose-600',
  },
]

function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold tracking-wider text-indigo-700">
            PLATFORM FEATURES
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Everything you need for
            <span className="block text-indigo-600">
              smarter attendance.
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500">
            A unified attendance platform combining intelligent
            management, transparent verification and modern
            technology for educational institutions.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
              >

                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition duration-300 group-hover:scale-110`}>
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                <p className="mt-7 text-xs font-bold tracking-wider text-slate-300">
                  0{index + 1}
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>

              </article>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default Features
