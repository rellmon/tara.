import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { getPageTitle } from '../../utils/pageTitle'

function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = getPageTitle(pathname)
    window.scrollTo(0, 0)

    // After navigating, move focus to the new page's content so keyboard and
    // screen reader users start there. Not done on the very first load.
    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none sm:px-6"
        >
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

export default Layout