import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { TRIP_SECTIONS } from './tripSections'
import type { TripSectionId } from './tripSections'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function TripSectionNav() {
  const [activeId, setActiveId] = useState<TripSectionId | null>(null)

  // Highlight the section that is crossing a "reading line" near the top
  // of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as TripSectionId)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )

    for (const section of TRIP_SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: TripSectionId) {
    event.preventDefault()

    const target = document.getElementById(id)
    if (!target) return

    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    // Keyboard and screen reader users continue from the section.
    target.focus({ preventScroll: true })
    setActiveId(id)
  }

  return (
    <nav
      aria-label="Trip sections"
      className="sticky top-16 z-40 -mx-4 mt-8 border-b border-line bg-cream/95 px-4 backdrop-blur sm:-mx-6 sm:px-6"
    >
      <ul className="flex gap-1 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TRIP_SECTIONS.map((section) => {
          const isActive = section.id === activeId

          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                onClick={(event) => jumpTo(event, section.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-600 ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-brand-700 hover:bg-brand-50'
                }`}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TripSectionNav