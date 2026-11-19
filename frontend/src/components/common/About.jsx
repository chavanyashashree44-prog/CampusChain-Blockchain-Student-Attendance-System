import {
  ShieldCheck,
  Database,
  Fingerprint,
  LockKeyhole,
} from 'lucide-react'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Trustworthy Records',
    description:
      'Attendance entries are recorded through verified blockchain transactions.',
  },
  {
    icon: Database,
    title: 'Secure Data Management',
    description:
      'Student information is managed securely, while only minimal verification data is stored on-chain.',
  },
  {
    icon: Fingerprint,
    title: 'Transparent Verification',
    description:
      'Every confirmed attendance record can be independently verified using its transaction reference.',
  },
  {
    icon: LockKeyhole,
    title: 'Controlled Access',
    description:
      'Dedicated student, faculty and administrator roles help protect system operations.',
  },
]

function About() {
  return (
    <section id="about" className="bg-slate-50 px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold tracking-wider text-indigo-700">
            ABOUT CAMPUSCHAIN
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            A smarter way to
            <span className="block text-indigo-600">
              manage attendance.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            CampusChain is a blockchain-based student attendance
            management system designed to make classroom attendance
            more structured, transparent and verifiable.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            By combining time-limited QR sessions, faculty verification
            and smart contract technology, the platform aims to reduce
            manual record-keeping and provide a reliable audit trail
            for confirmed attendance.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default About