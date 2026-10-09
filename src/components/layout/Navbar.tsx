import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/trips', label: 'My Trips' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-3 text-sm font-medium transition-colors md:py-2 ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-muted hover:text-charcoal'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-2xl font-bold text-brand-600">
          tara.
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-full p-2.5 text-charcoal hover:bg-sage md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={linkClasses}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Navbar