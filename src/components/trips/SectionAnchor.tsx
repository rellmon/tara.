import type { ReactNode } from 'react'
import type { TripSectionId } from './tripSections'

interface SectionAnchorProps {
  id: TripSectionId
  children: ReactNode
}

// Wraps a group of sections so the jump bar can scroll to it.
function SectionAnchor({ id, children }: SectionAnchorProps) {
  return (
    <div id={id} tabIndex={-1} className="scroll-mt-10 focus:outline-none">
      {children}
    </div>
  )
}

export default SectionAnchor