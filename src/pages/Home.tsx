import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Backpack,
  CalendarDays,
  Receipt,
  Wallet,
} from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Day-by-day itineraries',
    description:
      'Lay out every stop, meal, and activity so everyone knows what is next.',
  },
  {
    icon: Wallet,
    title: 'Budget planner',
    description:
      'Estimate costs per person and see what is left before you even leave.',
  },
  {
    icon: Receipt,
    title: 'Split expenses',
    description:
      'Record who paid for what and see exactly who owes whom. No awkward math.',
  },
  {
    icon: Backpack,
    title: 'Packing checklists',
    description:
      'Keep a list for each trip so nobody forgets the sunscreen or the charger.',
  },
]

const primaryLinkClasses =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

function Home() {
  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero */}
      <section className="pt-6 text-center sm:pt-14">
        <p className="inline-block rounded-full bg-sage px-4 py-1 text-sm font-medium text-brand-900">
          Plan together. Explore together.
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight text-brand-900 sm:text-6xl">
          Your next adventure starts here.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Tara helps your barkada plan trips, organize itineraries, and split
          the costs, all in one place.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/trips" className={primaryLinkClasses}>
            Start planning
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-center font-display text-3xl font-bold text-brand-900"
        >
          Everything your barkada needs
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <feature.icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-charcoal">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="rounded-3xl bg-brand-900 px-6 py-12 text-center sm:py-16">
        <h2 className="font-display text-3xl font-bold text-cream">
          Tara na?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-brand-100">
          Pick a destination, gather your friends, and start the plan.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/trips"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-6 py-3 text-base font-medium text-charcoal transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunset"
          >
            Create your first trip
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home