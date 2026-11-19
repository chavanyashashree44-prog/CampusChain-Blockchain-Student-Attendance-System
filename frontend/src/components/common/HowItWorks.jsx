
import {
  GraduationCap,
  QrCode,
  UserCheck,
  Blocks,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Create Attendance Session',
    description:
      'Faculty selects a subject and creates an attendance session with a defined time window.',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    number: '02',
    title: 'Generate & Scan QR',
    description:
      'A time-limited QR code is generated. Authenticated students scan it to submit attendance requests.',
    icon: QrCode,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    number: '03',
    title: 'Verify Attendance',
    description:
      'The system validates student identity, session validity and duplicate attendance before faculty approval.',
    icon: UserCheck,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    number: '04',
    title: 'Record on Blockchain',
    description:
      'Faculty confirms the transaction through the authorized wallet, and the smart contract records attendance.',
    icon: Blocks,
    color: 'bg-amber-50 text-amber-600',
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold tracking-wider text-indigo-700">
            <ShieldCheck size={15} />
            SIMPLE WORKFLOW
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Attendance made
            <span className="block text-indigo-600">
              simple and secure.
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500">
            From creating an attendance session to recording
            verified entries on blockchain, every step follows
            a structured workflow.
          </p>

        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
              >

                <div className="flex items-center justify-between">

                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                    <Icon size={26} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-extrabold text-slate-100">
                    {step.number}
                  </span>

                </div>

                <h3 className="mt-8 text-lg font-bold leading-7 text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <div className="absolute -right-4 top-12 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-500 lg:flex">
                    <ArrowRight size={16} />
                  </div>
                )}

              </div>
            )
          })}

        </div>

        {/* Bottom Information */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-slate-950 p-7 text-white sm:flex-row sm:p-9">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3 className="text-base font-bold">
                Designed for trustworthy attendance.
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Blockchain transactions provide verifiable,
                tamper-evident attendance records with a
                transparent audit trail.
              </p>
            </div>
          </div>

          <a
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
            <ArrowRight size={16} />
          </a>

        </div>

      </div>
    </section>
  )
}

export default HowItWorks
