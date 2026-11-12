import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-brand-900">
        Page not found
      </h1>
      <p className="mx-auto mt-2 max-w-md text-muted">
        That page doesn't exist. The link may be old or mistyped.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Go home
        </Link>
        <Link
          to="/trips"
          className="rounded-full bg-sage px-5 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:bg-sage-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          My Trips
        </Link>
      </div>
    </div>
  )
}

export default NotFound